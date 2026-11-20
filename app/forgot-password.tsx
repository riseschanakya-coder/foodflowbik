import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendReset = () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      setSent(false);
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </Pressable>

        <View style={styles.iconWrap}>
          <Ionicons name={sent ? 'checkmark-circle' : 'key'} size={34} color="#E23744" />
        </View>
        <Text style={styles.title}>{sent ? 'Check your phone' : 'Forgot password?'}</Text>
        <Text style={styles.subtitle}>
          {sent ? `A password reset code has been sent to +91 ${phone}` : 'Enter your mobile number and we’ll send you a reset code.'}
        </Text>

        {!sent ? (
          <>
            <Text style={styles.label}>Mobile number</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput value={phone} onChangeText={setPhone} placeholder="98765 43210" placeholderTextColor="#AAA" keyboardType="phone-pad" maxLength={10} style={styles.input} />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable style={styles.button} onPress={sendReset}>
              <Text style={styles.buttonText}>Send reset code</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.button} onPress={() => router.replace('/login')}>
            <Text style={styles.buttonText}>Back to login</Text>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, maxWidth: 460, width: '100%', alignSelf: 'center', paddingHorizontal: 22, justifyContent: 'center' },
  back: { position: 'absolute', top: 16, left: 22, width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE' },
  iconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: '#222', textAlign: 'center' },
  subtitle: { color: '#777', textAlign: 'center', lineHeight: 21, marginTop: 8, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '800', color: '#444', marginBottom: 7 },
  inputWrap: { height: 52, borderWidth: 1, borderColor: '#DDD', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, backgroundColor: '#fff' },
  prefix: { fontWeight: '800', color: '#333', borderRightWidth: 1, borderRightColor: '#DDD', paddingRight: 10, marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#222', outlineStyle: 'none' as any },
  error: { color: '#D9323E', fontSize: 12, marginTop: 8, fontWeight: '700' },
  button: { height: 54, borderRadius: 12, backgroundColor: '#E23744', marginTop: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});