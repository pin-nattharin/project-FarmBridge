import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

// Import Components ที่เราสร้างไว้
import CustomDropdown from '../components/ui/dropdown';
import RoundedInput from '../components/ui/RoundedInput';

export default function CreatePostScreen() {
  const router = useRouter();

  // --- States for Form Data ---
  const [image_url, setImage_Url] = useState<string | null>(null);
  const [product_name, setProduct_Name] = useState<string | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [quantity_total, setQuantity_Total] = useState('');
  const [price_per_unit, setPrice_Per_Unit] = useState('');
  const [pickup_date, setPickup_Date] = useState(new Date());
  const [description, setDescription] = useState('');
  //const [allowNegotiation, setAllowNegotiation] = useState(false);

  // --- States for UI (Dropdowns, DatePicker) ---
  const [productOpen, setProductOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Dropdown Items (ตัวอย่าง) ---
  const [productItems, setProductItems] = useState([
    { label: 'ทุเรียน', value: 'durian' },
    { label: 'มะม่วง', value: 'mango' },
    { label: 'มังคุด', value: 'mangosteen' },
    { label: 'องุ่น', value: 'grape' },
  ]);
  const [gradeItems, setGradeItems] = useState([
    { label: 'เกรด B (มีตำหนิบนผิวได้เล็กน้อย (เช่น จุดกระ ))', value: 'B' },
    { label: 'เกรด C (มีตำหนิบนผิว และขนาดเล็ก)', value: 'C' },
    { label: 'ต่ำกว่าเกรด C (มีตำหนิมาก เช่น มีรอยแผลเป็น)', value: 'C-' },
  ]);

  // --- Function: เลือกรูปภาพ ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage_Url(result.assets[0].uri);
    }
  };

  // --- Function: เลือกวันที่ ---
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || pickup_date;
    setShowDatePicker(Platform.OS === 'ios'); // บน iOS ปิดทันที
    setPickup_Date(currentDate);
  };

  // --- Function: กดโพสต์ ---
  const handlePost = () => {
    // รวบรวมข้อมูลทั้งหมด
    const postData = {
      image_url,
      product_name,
      grade,
      quantity_total,
      price_per_unit,
      pickupDate: pickup_date.toISOString(),
      description,
      //allowNegotiation,
    };
    console.log('Post Data:', postData);
    Alert.alert('โพสต์สำเร็จ!', 'ข้อมูลประกาศของคุณถูกบันทึกแล้ว');
    router.back(); // กลับไปหน้าก่อนหน้า
  };

  return (
    <>
      {/* 1. ส่วน Header (จัดการโดย Expo Router) */}
      <Stack.Screen
        options={{
          title: 'ฟีเจอร์ประกาศขาย 3',
          headerBackTitle: 'กลับ',
          headerRight: () => (
            // ใช้ปุ่มที่เราสร้างเอง แต่ต้องปรับแต่งนิดหน่อย
            <TouchableOpacity onPress={handlePost} style={styles.postButton}>
              <Text style={styles.postButtonText}>โพสต์</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* 2. ส่วน Form */}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* --- เลือกรูปภาพ --- */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image_url ? (
            <Image source={{ uri: image_url }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>+ เพิ่มรูปภาพสินค้า</Text>
          )}
        </TouchableOpacity>

        {/* --- ชื่อสินค้า (Dropdown) --- */}
        <Text style={styles.label}>ชื่อสินค้า</Text>
        <CustomDropdown
          open={productOpen}
          value={product_name}
          items={productItems}
          setOpen={setProductOpen}
          setValue={setProduct_Name}
          setItems={setProductItems}
          placeholder="เลือกชื่อสินค้า"
          containerStyle={{ zIndex: 1000, marginVertical: 8 }}
          // ปิดไม่ให้ Dropdown หลายอันเปิดพร้อมกัน
          onOpen={() => setGradeOpen(false)} 
        />

        {/* --- เกรดสินค้า (Dropdown) --- */}
        <Text style={styles.label}>เกรดสินค้า</Text>
        <CustomDropdown
          open={gradeOpen}
          value={grade}
          items={gradeItems}
          setOpen={setGradeOpen}
          setValue={setGrade}
          setItems={setGradeItems}
          placeholder="เลือกเกรดสินค้า"
          containerStyle={{ zIndex: 900, marginVertical: 8 }}
          onOpen={() => setProductOpen(false)}
        />

        {/* --- จำนวน --- */}
        <RoundedInput
          label="จำนวน (กิโลกรัม)"
          placeholder="ระบุจำนวน"
          value={quantity_total}
          onChangeText={setQuantity_Total}
          keyboardType="numeric"
        />

        {/* --- ราคา/กิโลกรัม --- */}
        <RoundedInput
        label="ราคา/กิโลกรัม (บาท)"
          placeholder="ระบุราคา"
          value={price_per_unit}
          onChangeText={setPrice_Per_Unit}
          keyboardType="numeric"
        />

        {/* --- วันที่สะดวก --- */}
        <Text style={styles.label}>วันที่สะดวกให้ผู้ซื้อมารับ</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {pickup_date.toLocaleDateString('th-TH')}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={pickup_date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* --- รายละเอียดเพิ่มเติม --- */}
        <RoundedInput
          label="รายละเอียดเพิ่มเติม"
          placeholder="เช่น สถานที่รับ, เวลา..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top', paddingTop: 16 }}
        />

        {/* --- Checkbox ต่อรองราคา --- */}
        {/* <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={allowNegotiation}
            onValueChange={setAllowNegotiation}
            color={allowNegotiation ? '#28A745' : undefined}
          />
          <Text style={styles.checkboxLabel}>เปิดต่อรองราคา</Text>
        </View> */}

      </ScrollView>
    </>
  );
}

// --- 4. Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // พื้นหลังสีเทาอ่อนแบบในรูป
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'white', // พื้นที่ฟอร์มสีขาว
    margin: 16,
    borderRadius: 12,
  },
  // Header Button
  postButton: {
    backgroundColor: '#28A745', // สีเขียว
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Image Picker
  imagePicker: {
    height: 200,
    width: '100%',
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // กันรูปทะลุขอบ
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    color: '#0052CC',
    fontSize: 16,
  },
  // Form Labels
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 10, // ระยะห่างบน
    marginBottom: 4, // ระยะห่างล่าง (ก่อน input)
  },
  // Date Picker
  datePickerButton: {
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#0052CC',
  },
  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
});