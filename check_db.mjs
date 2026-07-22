import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw4exMje14wkYRmMz46xiYIQpswXI27PU",
  authDomain: "pjr-fashion.firebaseapp.com",
  projectId: "pjr-fashion",
  storageBucket: "pjr-fashion.firebasestorage.app",
  messagingSenderId: "431601734777",
  appId: "1:431601734777:web:0608548db1175a005db0a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const possibleCollections = [
  'products', 'Products', 'product', 'ProductsList', 'items', 'catalog',
  'categories', 'Categories', 'brands', 'Brands', 'banners', 'Banners', 'settings'
];

async function checkCollections() {
  console.log('--- Checking Firestore Collections ---');
  for (const name of possibleCollections) {
    try {
      const snap = await getDocs(collection(db, name));
      if (!snap.empty) {
        console.log(`\nFOUND COLLECTION [${name}]: ${snap.docs.length} document(s)`);
        snap.docs.forEach(doc => {
          console.log(`Doc ID: ${doc.id}`);
          console.log(`Fields:`, JSON.stringify(doc.data(), null, 2));
        });
      } else {
        console.log(`Collection [${name}] is empty.`);
      }
    } catch (e) {
      console.log(`Collection [${name}] error:`, e.message);
    }
  }
}

checkCollections().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
