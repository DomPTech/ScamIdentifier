import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  heading: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    width: 300,
  },
  resultScam: {
    marginTop: 15,
    fontSize: 14,
    color: 'red',
  },
  resultSafe: {
    marginTop: 15,
    fontSize: 14,
    color: 'orange',
  },
  probability: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
});

export default styles;