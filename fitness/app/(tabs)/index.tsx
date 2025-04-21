import { View, Text, StyleSheet, TouchableOpacity, FlatList, PermissionsAndroid, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import BluetoothClassic from "react-native-bluetooth-classic";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";

export default function HomeScreen() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Check Bluetooth status on mount
  useEffect(() => {
    const checkBluetoothStatus = async () => {
      try {
        const enabled = await BluetoothClassic.isBluetoothEnabled();
        setIsBluetoothEnabled(enabled);
      } catch (error) {
        console.error("Bluetooth status check error:", error);
      }
    };
    checkBluetoothStatus();
  }, []);

  // Request Bluetooth permissions for Android
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  // Scan for Bluetooth devices
  const scanForDevices = async () => {
    try {
      setScanning(true);
      setModalVisible(true);

      // Check permissions
      const hasPermissions = await requestBluetoothPermissions();
      if (!hasPermissions) {
        alert("Bluetooth permissions are required to scan for devices.");
        setScanning(false);
        setModalVisible(false);
        return;
      }

      // Check if Bluetooth is enabled
      const isEnabled = await BluetoothClassic.isBluetoothEnabled();
      if (!isEnabled) {
        const enabled = await BluetoothClassic.requestBluetoothEnabled();
        if (!enabled) {
          alert("Bluetooth must be enabled to scan for devices.");
          setScanning(false);
          setModalVisible(false);
          return;
        }
        setIsBluetoothEnabled(true);
      }

      // Get paired devices
      const pairedDevices = await BluetoothClassic.getBondedDevices();
      
      // Start discovery for unpaired devices
      const discoveredDevices = await BluetoothClassic.startDiscovery();

      // Combine paired and unpaired devices, remove duplicates by address
      const allDevices = [...pairedDevices, ...discoveredDevices].reduce((unique, device) => {
        return unique.find(d => d.address === device.address) ? unique : [...unique, device];
      }, []);

      setDevices(allDevices);
    } catch (error) {
      console.error("Bluetooth scan error:", error);
      alert("Error scanning for devices: " + error.message);
    } finally {
      setScanning(false);
      setModalVisible(false);
    }
  };

  // Render each device in the list
  const renderDeviceItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
      <Text style={styles.deviceStatus}>{item.bonded ? "Paired" : "Unpaired"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Welcome to the home screen</Text>
        
        <TouchableOpacity
          style={[styles.button, scanning && styles.buttonDisabled]}
          onPress={scanForDevices}
          disabled={scanning}
        >
          <Icon name="bluetooth" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {scanning ? "Scanning..." : "Scan for Bluetooth Devices"}
          </Text>
        </TouchableOpacity>

        {devices.length > 0 && (
          <FlatList
            data={devices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.address}
            style={styles.deviceList}
          />
        )}

        {/* Scanning Modal */}
        <Modal isVisible={modalVisible} style={styles.modal}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.modalText}>Scanning for Bluetooth Devices...</Text>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deviceList: {
    width: "100%",
    maxHeight: 300,
  },
  deviceItem: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  deviceName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  deviceAddress: {
    color: "#BBBBBB",
    fontSize: 14,
  },
  deviceStatus: {
    color: "#1E88E5",
    fontSize: 14,
    marginTop: 5,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});