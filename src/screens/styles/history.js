import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  offlineBanner: {
    backgroundColor: '#FFA000',
    padding: 10,
    width: '100%',
  },
  offlineText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
    profileCard: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 15,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1976D2',
      marginBottom: 4,
    },
    userDetails: {
      fontSize: 16,
      color: '#757575',
    },
    summaryCard: {
      backgroundColor: '#1976D2',
      padding: 20,
      alignItems: 'center',
      margin: 15,
      borderRadius: 10,
      elevation: 3,
    },
    summaryTitle: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 8,
    },
    summaryAmount: {
      color: '#fff',
      fontSize: 28,
      fontWeight: 'bold',
    },
    logsContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    logsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1976D2',
      marginBottom: 15,
    },
    logItem: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: '#F8F9FA',
      borderRadius: 10,
      marginBottom: 10,
      elevation: 1,
    },
    logTime: {
      flex: 1,
    },
    timeText: {
      fontSize: 16,
      color: '#424242',
    },
    logAmount: {
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    amountText: {
      color: '#1976D2',
      fontWeight: 'bold',
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      color: '#757575',
      fontSize: 16,
      textAlign: 'center',
    },
    targetInfo: {
      width: '100%',
      marginTop: 10,
    },
    targetText: {
      color: '#fff',
      fontSize: 14,
      marginBottom: 5,
    },
    progressBar: {
      height: 6,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: 3,
    },
  });

  export default styles;