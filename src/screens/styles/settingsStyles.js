import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');
const isTablet = width >= 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: isTablet ? 30 : 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 34,
    marginBottom: 30,
  },
  settingContainer: {
    marginTop: isTablet ? 25 : 15,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    padding: isTablet ? 20 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderContainer: {
    paddingBottom: isTablet ? 25 : 20,
  },
  slider: {
    width: '100%',
    height: isTablet ? 50 : 40,
    marginTop: isTablet ? 20 : 15,
    marginBottom: isTablet ? 15 : 10,
  },
  settingItem: {
    fontSize: isTablet ? 20 : 16,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: isTablet ? 15 : 10,
    textAlign: 'center',
  },
  input: {
    height: isTablet ? 50 : 45,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: isTablet ? 18 : 16,
    backgroundColor: '#E3F2FD',
    color: '#0D47A1',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '48%',
  },
  targetText: {
    textAlign: 'center',
    color: '#2196F3',
    fontSize: isTablet ? 22 : 18,
    fontWeight: 'bold',
    marginTop: isTablet ? 10 : 5,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 10 : 5,
    marginTop: isTablet ? 10 : 5,
  },
  notificationText: {
    fontSize: isTablet ? 18 : 16,
    color: '#2196F3',
  },
  saveButton: {
    marginTop: isTablet ? 30 : 20,
    backgroundColor: '#2196F3',
    padding: isTablet ? 18 : 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: isTablet ? 22 : 18,
    fontWeight: 'bold',
  },
  typeSettingContainer:{
        flexDirection: "row",
        justifyContent:"space-evenly",
        alignItems:"center",
  },
  typeClasic:{
    padding:10,
    alignItems:"center",
    backgroundColor:'#E3F2FD',
    width:Dimensions.get('window').width / 2.5, 
    height:Dimensions.get('window').height / 20, 
  },
  typeClever:{
    padding:10,
    alignItems:"center",
    backgroundColor:'#E3F2FD',
    width:Dimensions.get('window').width / 2.5, 
    height:Dimensions.get('window').height / 20, 
  },
  typeText:{
    marginLeft:6,
    color:'red',
    fontWeight: 'bold',
  },
  typeTextClasic:{
    marginLeft:6,
    color:'green',
    fontWeight: 'bold',
  },
});

export default styles;