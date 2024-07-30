// Invoice.js
import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { useTheme } from '@mui/joy';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#008299',
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    color: 'gray',
  },
  address: {
    fontSize: 12,
    marginBottom: 5,
    color: '#7F8C8D',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#ECF0F1',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderBottomStyle: 'solid',
    borderRadius: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    border:"none",
    padding: 5,
  },
  tableCell: {
    fontSize: 12,
    color: "gray",
    textAlign: 'center',
  },
  total: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'gray',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#BDC3C7',
    borderTopStyle: 'solid',
    paddingTop: 10,
    color: '#7F8C8D',
  },
});

const generateTLV = (tag, value) => {
  const textEncoder = new TextEncoder();
  const valueBytes = textEncoder.encode(value);
  const length = valueBytes.length;
  const tlv = new Uint8Array(2 + length);
  tlv[0] = tag;
  tlv[1] = length;
  tlv.set(valueBytes, 2);
  return tlv;
};

const encodeInvoiceDataToBase64 = (invoiceData) => {
  const { sellerName, vatNumber, timestamp, totalWithVAT, vatTotal } = invoiceData;

  const tlvData = new Uint8Array([
    ...generateTLV(1, sellerName),
    ...generateTLV(2, vatNumber),
    ...generateTLV(3, timestamp),
    ...generateTLV(4, totalWithVAT),
    ...generateTLV(5, vatTotal)
  ]);

  return btoa(String.fromCharCode(...tlvData));
};


// Create Document Component
export default function SubscriptionInvoice ({ subscription }) {
  const theme = useTheme();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const primaryMainColor = theme.palette.primary.main;
  const token = localStorage.getItem('token');
  console.log(primaryMainColor);
  const invoiceData = encodeInvoiceDataToBase64({"sellerName": "Fit Hub", "vatNumber": "326543231113243", 
    "timestamp": new Date().toISOString(), "totalWithVAT": subscription.totalAmount, "vatTotal": subscription.totalAmount * 0.15});
  console.log(invoiceData);
  useEffect(() => {
    async function generateQrCode() {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/qr-code?text=${invoiceData}&width=300&height=300`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'image/png',
            "Authorization": `Bearer ${token}`,
          },
        });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    }
    if(!qrCodeUrl){
    generateQrCode();
    }
  }, [subscription, qrCodeUrl, invoiceData, token]);
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.address}>2321, Hittin, Riyadh, Saudi Arabia</Text>
      </View>

      <View style={[styles.section, { display: "flex", flexDirection: "row", justifyContent: "space-between" }]}>
        <View>
          <Text style={[styles.header, {color:"#3e3f40"}]}>Bill To:</Text>
          <Text style={styles.address}>{subscription.firstName + " " + subscription.lastName}</Text>
          <Text style={styles.address}>{"Riyadh, Saudi"}</Text>
        </View>
        <View>
          <Text style={[styles.header, {color:"#3e3f40"}]}>#</Text>
          <View style={{display:"flex", flexDirection:"row"}}>
            <Text style={styles.address}>Invoice #</Text>
            <Text style={[styles.address, {paddingLeft:"30px"}]}>{subscription.reference}</Text>
          </View>
          <View style={{display:"flex", flexDirection:"row"}}>
            <Text style={styles.address}>Invoice Date </Text>
            <Text style={[styles.address, {paddingLeft:"20px"}]}>{new Date().toUTCString().substring(0, 16)}</Text>
          </View>
        </View>
        <View>
          <Image src={qrCodeUrl} style={{ width: 100, height: 100 }} alt="QR Code" />
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader, {backgroundColor: "#008299"||primaryMainColor, color:"white"}]}>
          <View style={styles.tableCol}><Text style={[styles.tableCell, {color:"white"}]}>Subscription</Text></View>
          <View style={styles.tableCol}><Text style={[styles.tableCell, {color:"white"}]}>Quantity</Text></View>
          <View style={styles.tableCol}><Text style={[styles.tableCell, {color:"white"}]}>Price</Text></View>
          <View style={styles.tableCol}><Text style={[styles.tableCell, {color:"white"}]}>Total</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{`${subscription.product.name}(${subscription.product.category.name})`}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{subscription.subscriptionQty}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{subscription.subscriptionUnitPrice} SAR</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{subscription.totalAmount} SAR</Text></View>
        </View>
      </View>

      <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
        <View style={{display:"flex", flexDirection:"column", justifyContent:"flex-end", textAlign:"right"}}>
          <Text style={styles.total}>Subtotal</Text> 
          <Text style={styles.total}>VAT (15%)</Text>
          <Text style={styles.total}>Discount</Text>
          <Text style={styles.total}>Total</Text>
        </View>
        <View>
          <Text style={styles.total}>SAR {subscription.totalAmount.toLocaleString()}</Text>
          <Text style={styles.total}>SAR {(subscription.totalAmount * 0.15).toLocaleString()}</Text>
          <Text style={styles.total}>SAR {subscription.discountAmount.toLocaleString()} </Text>
          <Text style={styles.total}>SAR {(subscription.totalAmount + subscription.totalAmount * 0.15 - subscription.discountAmount).toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);
}

