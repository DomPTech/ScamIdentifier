import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginTop: 15,
    marginBottom: 15,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  mainInput: {
    paddingVertical: 12,
    marginBottom: 20,
    width: 300,
  },
  primaryButton: {
    backgroundColor: '#c32323',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultScam: {
    marginTop: 15,
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  resultSafe: {
    marginTop: 15,
    fontSize: 20,
    color: 'orange',
    fontWeight: 'bold',
  },
  probability: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
  contactsButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#c32323',
  },
  contactsButtonText: {
    color: '#c32323',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default styles;
