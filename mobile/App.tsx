import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchWorkers, fetchCategories } from './src/api';
import { WorkerProfile, ServiceCategory } from './src/types';

export default function App() {
  const [tab, setTab] = useState<'home' | 'search' | 'detail' | 'bookings'>('home');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [cats, wrks] = await Promise.all([
      fetchCategories(),
      fetchWorkers(),
    ]);
    setCategories(cats);
    setWorkers(wrks);
    setLoading(false);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (whatsapp: string, workerName: string) => {
    const text = encodeURIComponent(`Assalam o Alaikum ${workerName}, I found you on Kaam Wala Pakistan app.`);
    Linking.openURL(`https://wa.me/${whatsapp}?text=${text}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      {/* Top Mobile Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.brandTitle}>Kaam<Text style={styles.brandAccent}>Wala</Text> PK</Text>
          <View style={styles.badgeFree}>
            <Text style={styles.badgeFreeText}>🇵🇰 100% FREE</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Find Trusted Local Workers Across Pakistan</Text>
      </View>

      {/* Main Body */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0d9488" />
          <Text style={styles.loadingText}>Connecting to Kaam Wala Network...</Text>
        </View>
      ) : tab === 'home' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Search */}
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.8}
            onPress={() => setTab('search')}
          >
            <Text style={styles.searchText}>🔍 Search Electrician, Plumber, AC...</Text>
          </TouchableOpacity>

          {/* Categories Grid */}
          <Text style={styles.sectionHeader}>Categories (ہنرمند خدمات)</Text>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 8).map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => {
                  setSelectedCat(cat.name);
                  setTab('search');
                }}
              >
                <View style={styles.categoryIconCircle}>
                  <Text style={{ fontSize: 18 }}>🛠️</Text>
                </View>
                <Text style={styles.categoryTitle} numberOfLines={1}>{cat.name}</Text>
                <Text style={styles.categoryUrdu} numberOfLines={1}>{cat.nameUrdu}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Verified Workers */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionHeader}>Top Rated Technicians</Text>
            <TouchableOpacity onPress={() => setTab('search')}>
              <Text style={styles.linkText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {workers.slice(0, 5).map(worker => (
            <TouchableOpacity
              key={worker.id}
              style={styles.workerCard}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedWorker(worker);
                setTab('detail');
              }}
            >
              <Image source={{ uri: worker.avatar }} style={styles.workerAvatar} />
              <View style={styles.workerInfo}>
                <View style={styles.workerNameRow}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.ratingText}>⭐ {worker.ratingAverage || '5.0'}</Text>
                </View>
                <Text style={styles.workerCategory}>{worker.serviceCategory}</Text>
                <Text style={styles.workerLocation}>📍 {worker.area ? `${worker.area}, ` : ''}{worker.city}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>Visit: Rs. {worker.visitingFee}</Text>
                  <Text style={styles.expText}>{worker.experienceYears} Yrs Exp</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : tab === 'search' ? (
        <View style={styles.content}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Search by worker name, category, or city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView>
            {workers
              .filter(w => !selectedCat || w.serviceCategory.toLowerCase().includes(selectedCat.toLowerCase()))
              .filter(w => !searchQuery || w.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(worker => (
                <TouchableOpacity
                  key={worker.id}
                  style={styles.workerCard}
                  onPress={() => {
                    setSelectedWorker(worker);
                    setTab('detail');
                  }}
                >
                  <Image source={{ uri: worker.avatar }} style={styles.workerAvatar} />
                  <View style={styles.workerInfo}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerCategory}>{worker.serviceCategory}</Text>
                    <Text style={styles.workerLocation}>{worker.city} ({worker.area})</Text>
                    <Text style={styles.priceText}>Visiting: Rs. {worker.visitingFee}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ) : tab === 'detail' && selectedWorker ? (
        <ScrollView style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setTab('home')}>
            <Text style={styles.backBtnText}>← Back to Home</Text>
          </TouchableOpacity>

          <View style={styles.detailCard}>
            <Image source={{ uri: selectedWorker.avatar }} style={styles.detailAvatar} />
            <Text style={styles.detailName}>{selectedWorker.name}</Text>
            <Text style={styles.detailCat}>{selectedWorker.serviceCategory}</Text>
            <Text style={styles.detailLoc}>📍 {selectedWorker.city}, {selectedWorker.province}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.btnCall}
                onPress={() => handleCall(selectedWorker.phone)}
              >
                <Text style={styles.btnCallText}>📞 Call {selectedWorker.phone}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnWhatsapp}
                onPress={() => handleWhatsApp(selectedWorker.whatsapp, selectedWorker.name)}
              >
                <Text style={styles.btnWhatsappText}>💬 WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>About Worker</Text>
              <Text style={styles.infoText}>{selectedWorker.bio}</Text>
            </View>

            <TouchableOpacity
              style={styles.btnBook}
              onPress={() => Alert.alert('Booking Request', `Request submitted to ${selectedWorker.name}. They will call you shortly.`)}
            >
              <Text style={styles.btnBookText}>Send Service Request (Free)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}

      {/* Bottom Tabs */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setTab('home')}>
          <Text style={tab === 'home' ? styles.navActive : styles.navInactive}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setTab('search')}>
          <Text style={tab === 'search' ? styles.navActive : styles.navInactive}>🔍 Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => Alert.alert('Customer Portal', 'Login to view active bookings.')}
        >
          <Text style={styles.navInactive}>📅 Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#0f766e', padding: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  brandAccent: { color: '#5eead4' },
  badgeFree: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeFreeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  headerSubtitle: { color: '#ccfbf1', fontSize: 11, marginTop: 4 },
  content: { flex: 1, padding: 14 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#0f766e', fontSize: 12, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 14 },
  searchText: { color: '#94a3b8', fontSize: 12 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  linkText: { color: '#0d9488', fontSize: 12, fontWeight: 'bold' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryItem: { width: '23%', backgroundColor: '#fff', padding: 8, borderRadius: 12, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  categoryIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdfa', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  categoryTitle: { fontSize: 9, fontWeight: 'bold', color: '#1e293b' },
  categoryUrdu: { fontSize: 8, color: '#0d9488' },
  workerCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  workerAvatar: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  workerInfo: { flex: 1 },
  workerNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workerName: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: '#d97706' },
  workerCategory: { fontSize: 11, fontWeight: '600', color: '#0d9488' },
  workerLocation: { fontSize: 10, color: '#64748b', marginTop: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  priceText: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  expText: { fontSize: 10, color: '#64748b' },
  inputSearch: { backgroundColor: '#fff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 10, fontSize: 12 },
  backBtn: { paddingVertical: 8, marginBottom: 8 },
  backBtnText: { color: '#0d9488', fontSize: 12, fontWeight: 'bold' },
  detailCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  detailAvatar: { width: 80, height: 80, borderRadius: 16, marginBottom: 8 },
  detailName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  detailCat: { fontSize: 13, fontWeight: 'bold', color: '#0d9488', marginTop: 2 },
  detailLoc: { fontSize: 11, color: '#64748b', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16 },
  btnCall: { flex: 1, backgroundColor: '#0f172a', padding: 10, borderRadius: 10, marginRight: 6, alignItems: 'center' },
  btnCallText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  btnWhatsapp: { flex: 1, backgroundColor: '#16a34a', padding: 10, borderRadius: 10, marginLeft: 6, alignItems: 'center' },
  btnWhatsappText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  infoBox: { width: '100%', backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 14 },
  infoTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  infoText: { fontSize: 11, color: '#475569', lineHeight: 16 },
  btnBook: { width: '100%', backgroundColor: '#0d9488', padding: 12, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  btnBookText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', height: 50, borderTopWidth: 1, borderColor: '#e2e8f0', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center' },
  navActive: { color: '#0d9488', fontSize: 11, fontWeight: 'bold' },
  navInactive: { color: '#94a3b8', fontSize: 11 },
});
