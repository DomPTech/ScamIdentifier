import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { addContact, getContacts, MAX_CONTACTS, removeContact, TrustedContact } from '../../storage/trustedContacts';
import globalStyles from '../styles';

interface Props {
  message: string;
  onClose: () => void;
}

function formattedMessage(message: string): string {
  return `Hi, I recieved this message: \n \n"${message}" \n \nWhat should I do?`;
}

async function openMessagingApp(phoneNumber: string, message: string) {
  // iOS uses '&' to append parameters, Android uses '?'
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const url = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Messaging app is not supported on this device');
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred while opening the messaging app');
  }
};

export default function TrustedContactsView({ message, onClose }: Props) {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setContacts(await getContacts());
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd() {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await addContact(name, phone);
      setName('');
      setPhone('');
      await load();
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save contact.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await removeContact(id);
    await load();
  }

  return (
    <View style={globalStyles.overlay}>
      <View style={globalStyles.sheet}>
        <View style={styles.header}>
          <Text style={[globalStyles.heading, styles.title]}>
            Click a Trusted Contact to ask about your Message
          </Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={c => c.id}
          ListEmptyComponent={<Text style={styles.empty}>No trusted contacts yet.</Text>}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => openMessagingApp(item.phone, formattedMessage(message))}>
              <View style={styles.rowText}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id)} hitSlop={12}>
                <Text style={styles.delete}>Delete</Text>
              </Pressable>
            </Pressable>
          )}
          style={styles.list}
        />

        {contacts.length < MAX_CONTACTS && (
          <View style={styles.form}>
            <Text style={globalStyles.subheading}>Add a contact</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Pressable
              style={[
                globalStyles.primaryButton,
                (saving || !name.trim() || !phone.trim()) && globalStyles.primaryButtonDisabled,
              ]}
              onPress={handleAdd}
              disabled={saving || !name.trim() || !phone.trim()}
            >
              <Text style={globalStyles.primaryButtonText}>Save</Text>
            </Pressable>
          </View>
        )}
        {contacts.length >= MAX_CONTACTS && (
          <Text style={styles.limitNote}>You've reached the {MAX_CONTACTS}-contact limit.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    flex: 1,
    fontSize: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  closeButton: { fontSize: 20, color: '#555', paddingLeft: 12 },
  list: { flexGrow: 0 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, marginBottom: 40, fontSize: 15 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  rowText: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600', color: '#111' },
  contactPhone: { fontSize: 14, color: '#555', marginTop: 2 },
  delete: { fontSize: 18, color: '#c32323', paddingLeft: 12 },
  form: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  limitNote: { textAlign: 'center', color: '#888', padding: 16, fontSize: 14 },
});
