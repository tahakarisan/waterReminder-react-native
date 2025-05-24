import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    route:{
        width:100,
        backgroundColor:"#f4f4f4",
        padding:10,
        borderRadius:10,
        marginTop:-60,
        marginBottom:50,
        marginRight:250
      },
      mainContainer: {
        marginTop:60,
        padding: 20,
        backgroundColor: "#f4f4f4",
        borderRadius: 10,
        alignItems: "center",
        width: "90%",
        height:400,
        alignSelf: "center",
      },
      container: {
        marginTop:80,
        padding: 20,
        backgroundColor: "#f4f4f4",
        borderRadius: 10,
        alignItems: "center",
        width: "90%",
        height:400,
        alignSelf: "center",
      },
      editContainer: {
        marginTop:80,
        padding: 20,
        backgroundColor: "#f4f4f4",
        borderRadius: 10,
        alignItems: "center",
        width: "80%",
        height:400,
        alignSelf: "center",
        elevation: 3, // Android gölgelendirme
        shadowColor: "#000", // iOS gölgelendirme
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      infoContainer: {
        width: "100%",
        gap: 10, // Bileşenler arasına boşluk bırakır (React Native 0.71+)
      },
      profileInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      profileText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#555",
      },
      profileTitleText: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#555",
        textAlign:"center",
        marginBottom:-40,
      },
      text: {
        marginTop:3,
        fontSize: 13,
        color: "#333",
      },
      button: {
        marginTop: 50,
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
      },
      errorButton: {
        marginTop: 50,
        backgroundColor: "#B00020",
        marginLeft:12,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Android gölgelendirme
      },
      input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
      },
  });

  export default styles;