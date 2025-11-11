import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';

// สีที่ใช้ (โดยประมาณจากรูป)
const COLORS = {
  primary: '#074E9F', // สีน้ำเงินเข้ม (ตัวหนังสือ, พื้นหลังตอนเลือก)
  lightBlue: '#E0ECFF', // สีฟ้าอ่อน (พื้นหลังปุ่ม)
  white: '#FFFFFF',
  text: '#074E9F', // สีตัวหนังสือปกติ (สีน้ำเงินเข้ม)
};

// เราจะรับ Props ส่วนใหญ่มาจาก DropDownPicker โดยตรง
// และเพิ่ม 'containerStyle' สำหรับการจัด zIndex
type CustomDropdownProps = DropDownPickerProps<any> & {
  containerStyle?: StyleProp<ViewStyle>;
};

const CustomDropdown = (props: CustomDropdownProps) => {
  return (
    // เราใช้ View ห่ออีกชั้นเพื่อจัดการ zIndex และ layout
    <View style={[styles.wrapper, props.containerStyle]}> 
      <DropDownPicker
        {...props} // ส่ง props ทั้งหมดที่รับเข้ามา (เช่น open, value, items, setOpen, setValue, setItems)
        
        // --- นี่คือส่วนของการปรับแต่ง Style ที่เราห่อหุ้มไว้ ---
        style={[styles.dropdownButton, props.style]} // Style ของปุ่มหลัก
        textStyle={styles.dropdownButtonText} // Style ของข้อความบนปุ่ม
        
        dropDownContainerStyle={styles.dropdownListContainer} // Style ของกล่องรายการ
        
        listItemLabelStyle={styles.dropdownListItemText} // Style ของข้อความในรายการ
        
        selectedItemContainerStyle={styles.dropdownSelectedContainer} // Style ของรายการที่ถูกเลือก
        selectedItemLabelStyle={styles.dropdownSelectedText} // Style ของข้อความที่ถูกเลือก
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // zIndex จะถูกส่งเข้ามาผ่าน props.containerStyle
  },
  // 1. ปุ่มหลัก (ตอนปิด)
  dropdownButton: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    borderWidth: 0, // เอาขอบสีเทาเดิมออก
    paddingHorizontal: 16,
    height: 50,
  },
  // 2. ข้อความบนปุ่มหลัก
  dropdownButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  // 3. กล่องรายการ (ตอนเปิด)
  dropdownListContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8, // ให้มีระยะห่างจากปุ่ม
  },
  // 4. ข้อความในรายการ (ที่ยังไม่ถูกเลือก)
  dropdownListItemText: {
    color: COLORS.text,
    fontSize: 16,
    paddingLeft: 10,
  },
  // 5. พื้นหลังของรายการ (ที่ถูกเลือก)
  dropdownSelectedContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  // 6. ข้อความของรายการ (ที่ถูกเลือก)
  dropdownSelectedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 10,
  },
});

export default CustomDropdown;