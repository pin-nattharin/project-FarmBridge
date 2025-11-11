import React from 'react';
// 1. เพิ่ม StyleSheet เข้าไปใน import
import { View, Text, StyleSheet } from 'react-native'; 
import { Link } from 'expo-router';

// 2. ย้าย 'const styles' ทั้งหมดขึ้นมาไว้ "ก่อน"
//    ที่ฟังก์ชัน HomeScreen จะเรียกใช้
const styles = StyleSheet.create({
  container: {
    flex: 1, // (ผมเพิ่ม flex: 1 ให้เป็นตัวอย่าง)
    justifyContent: 'center',
    padding: 20,
  },
  testLink: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    textAlign: 'center',
  },
});

// ✅ ถูก - ใช้ 'export default'
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* ... โค้ดเดิมของคุณ ... */}

      {/* --- เพิ่มส่วนนี้เข้าไป --- */}
      <Link href="/test-components" style={styles.testLink}>
        <Text>ไปหน้า Test Components</Text>
      </Link>
      <Link href="/createPost" style={styles.testLink}>
        <Text>ไปหน้า creatPost</Text>
      </Link>
    </View>
  );
}

// (ลบ const styles ของเดิมออกจากตรงนี้)