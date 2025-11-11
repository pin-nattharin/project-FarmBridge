import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // 🟢 สำหรับพื้นหลังไล่ระดับ

// *** ตรวจสอบ Path การ Import ให้ถูกต้อง ***
import RoundedInput from '../components/ui/RoundedInput'; 
import Button from '../components/ui/Button'; 

// สร้างตัวแปร styles ที่สามารถ export เพื่อให้ LoginScreen ใช้งานได้
export const registerBaseStyles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%', 
        // ลบ backgroundColor และ opacity ออก เพราะ LinearGradient จัดการแทน
    },
    scrollContainer: {
        paddingTop: 90,
        alignItems: 'center',
    },
    card: {
        width: '90%',
        maxWidth: 450,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        paddingTop: 40,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
        marginBottom: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 30,
    },
    label: {
      fontSize: 14,
      color: '#4A5568',
      marginBottom: 5,
    },
    uploadContainer: {
      marginBottom: 10,
    },
    uploadText: {
      fontSize: 14,
      color: '#A0AEC0',
      marginLeft: 10,
    },
    registerButton: {
      marginTop: 20,
      marginBottom: 0,
      backgroundColor: '#22AB67', 
      borderColor: '#22AB67',
    },
    // เพิ่ม link styles ที่จำเป็นสำหรับ LoginScreen
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    linkText: {
        fontSize: 14,
        color: '#718096', 
    },
});

const RegisterBuyerScreen: React.FC = () => {
  const handleRegister = () => {
    console.log('Register pressed');
  };

  return (
    <View style={registerBaseStyles.fullScreen}>
      {/* ใช้ LinearGradient สำหรับพื้นหลังไล่ระดับสี */}
      <LinearGradient
        colors={['#22AB67', '#074E9F']} // สีเขียว -> ฟ้า
        style={registerBaseStyles.backgroundTop}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={registerBaseStyles.scrollContainer}>
        <View style={registerBaseStyles.card}>
          <Text style={registerBaseStyles.header}>สมัครสมาชิก</Text>

          <RoundedInput label="ชื่อ" placeholder="ชื่อ-นามสกุล" />
          <RoundedInput label="อีเมล" placeholder="example@mail.com" keyboardType="email-address" />
          <RoundedInput label="เบอร์โทรศัพท์" placeholder="0XXXXXXXXX" keyboardType="phone-pad" />
          <RoundedInput label="รหัสผ่าน" placeholder="********" secureTextEntry />
          <RoundedInput label="ยืนยันรหัสผ่าน" placeholder="********" secureTextEntry />
          <RoundedInput label="ที่อยู่" placeholder="เลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด" multiline />
          
          <Button 
            title="สมัครสมาชิก" 
            onPress={handleRegister} 
            variant="default" 
            style={registerBaseStyles.registerButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterBuyerScreen;