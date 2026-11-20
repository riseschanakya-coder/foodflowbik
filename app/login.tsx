import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';

export default function Login() {
  const { login } = useStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000');
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'foodflow' });
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || !googleClientId) return;

    const existingScript = document.querySelector('script[data-google-identity]');
    const initializeGoogle = () => {
      const google = (window as Window & {
        google?: {
          accounts?: {
            id?: {
              initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
              renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
            };
          };
        };
      }).google;
      const button = document.getElementById('google-signin-button');
      if (!google?.accounts?.id || !button) return;

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          setGoogleLoading(true);
          try {
            const verifyResponse = await fetch(`${apiUrl}/api/auth/google/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential }),
            });
            const result = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(result.error || 'Google authentication failed.');

            login(result.user.name, result.token);
            setError('');
            router.replace('/(tabs)');
          } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Google authentication failed.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });
      button.innerHTML = '';
      google.accounts.id.renderButton(button, {
        theme: 'outline',
        size: 'large',
        width: 360,
        text: 'continue_with',
        shape: 'rectangular',
      });
    };

    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);
      return () => existingScript.removeEventListener('load', initializeGoogle);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.addEventListener('load', initializeGoogle);
    document.head.appendChild(script);
    return () => script.removeEventListener('load', initializeGoogle);
  }, [googleClientId, apiUrl]);

  const [googleRequest, googleResponse, promptGoogle] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId || 'missing-google-client-id',
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  useEffect(() => {
    const exchangeGoogleCode = async () => {
      if (googleResponse?.type !== 'success') return;

      const code = googleResponse.params.code;
      const codeVerifier = googleRequest?.codeVerifier;
      if (!code || !codeVerifier) {
        setError('Google authentication did not return a valid authorization code.');
        setGoogleLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/auth/google/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, codeVerifier, redirectUri }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Google authentication failed.');

        login(result.user.name, result.token);
        setError('');
        router.replace('/(tabs)');
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Google authentication failed.');
      } finally {
        setGoogleLoading(false);
      }
    };

    exchangeGoogleCode();
  }, [googleResponse]);

  const handleGoogleLogin = async () => {
    setError('');
    if (!googleClientId) {
      setError('Google authentication is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.');
      return;
    }
    setGoogleLoading(true);
    await promptGoogle();
  };

  const handleLogin = () => {
    if (!phone.trim()) {
      setError('Enter your mobile number');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (password.length < 4) {
      setError('Password must contain at least 4 characters');
      return;
    }
    setError('');
    login(name);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.brandWrap}>
          <View style={styles.logo}><Ionicons name="restaurant" size={30} color="#fff" /></View>
          <Text style={styles.brand}>FoodFlow</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Hungry already?</Text>
          <Text style={styles.subtitle}>Sign in and let’s find something delicious nearby</Text>

          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={20} color="#777" />
            <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#AAA" style={styles.input} />
          </View>

          <Text style={styles.label}>Mobile number</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="98765 43210" placeholderTextColor="#AAA" keyboardType="phone-pad" maxLength={10} style={styles.input} />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color="#777" />
            <TextInput value={password} onChangeText={setPassword} placeholder="Enter password" placeholderTextColor="#AAA" secureTextEntry={!showPassword} style={styles.input} />
            <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#777" />
            </Pressable>
          </View>

          <Pressable style={styles.forgotButton} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>

          <Pressable style={styles.guestButton} onPress={() => { login('Guest'); router.replace('/(tabs)'); }}>
            <Text style={styles.guestText}>Continue as guest</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {Platform.OS === 'web' && googleClientId ? (
            <View nativeID="google-signin-button" style={styles.googleIdentityButton} />
          ) : (
            <Pressable
              style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleLogin}
              disabled={googleLoading || !googleRequest}
            >
              <View style={styles.googleIcon}><Text style={styles.googleG}>G</Text></View>
              <Text style={styles.googleText}>{googleLoading ? 'Connecting...' : 'Continue with Google'}</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.terms}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 22, maxWidth: 460, width: '100%', alignSelf: 'center' },
  brandWrap: { alignItems: 'center', marginBottom: 26 },
  logo: { width: 58, height: 58, borderRadius: 18, backgroundColor: '#E23744', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }] },
  brand: { fontSize: 25, fontWeight: '900', color: '#242424', marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#ECECEC', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  title: { fontSize: 24, fontWeight: '900', color: '#222' },
  subtitle: { color: '#777', marginTop: 5, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '800', color: '#444', marginBottom: 7, marginTop: 11 },
  inputWrap: { height: 52, borderWidth: 1, borderColor: '#DDD', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, backgroundColor: '#FCFCFC' },
  prefix: { fontWeight: '800', color: '#333', borderRightWidth: 1, borderRightColor: '#DDD', paddingRight: 10, marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#222', marginLeft: 8, outlineStyle: 'none' as any },
  error: { color: '#D9323E', fontSize: 12, marginTop: 10, fontWeight: '700' },
  loginButton: { height: 54, borderRadius: 12, backgroundColor: '#E23744', marginTop: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  loginText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  guestButton: { height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  guestText: { color: '#E23744', fontWeight: '800' },
  terms: { textAlign: 'center', color: '#999', fontSize: 11, marginTop: 18, lineHeight: 16 },
  forgotButton: { marginTop: 12, alignSelf: 'flex-end' },
  forgotText: { color: '#E23744', fontWeight: '700', fontSize: 13 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#ECECEC' },
  dividerText: { width: 40, textAlign: 'center', color: '#999', fontSize: 12 },
  googleButton: { height: 52, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD', marginTop: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  googleButtonDisabled: { opacity: 0.65 },
  googleIdentityButton: { height: 52, marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  googleIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  googleG: { color: '#DB4437', fontWeight: '700', fontSize: 16 },
  googleText: { color: '#222', fontWeight: '500', fontSize: 14 },
});