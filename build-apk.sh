#!/bin/bash
set -e

echo "=========================================================="
echo "  Building Kaam Wala Pakistan Android Native APK (.apk)   "
echo "=========================================================="

# Create directories
mkdir -p android-build/obj android-build/bin public/downloads dist/downloads

# 1. Package Android resources and generate R.java
echo "-> 1. Compiling Android resources and R.java with aapt..."
aapt package -f -m -J android-build/src \
  -M android-build/AndroidManifest.xml \
  -S android-build/res \
  -I /usr/lib/android-sdk/platforms/android-23/android.jar

# 2. Compile Java source code
echo "-> 2. Compiling Java bytecode with javac..."
javac -source 1.8 -target 1.8 \
  -d android-build/obj \
  -cp /usr/lib/android-sdk/platforms/android-23/android.jar \
  android-build/src/com/kaamwalapakistan/app/*.java

# 3. Convert bytecode to Dalvik executable (classes.dex)
echo "-> 3. Converting to classes.dex with dx..."
dx --dex --output=android-build/bin/classes.dex android-build/obj

# 4. Package unaligned APK
echo "-> 4. Packaging unaligned APK..."
rm -f android-build/bin/kaam-wala-unaligned.apk android-build/bin/kaam-wala-aligned.apk
aapt package -f \
  -M android-build/AndroidManifest.xml \
  -S android-build/res \
  -I /usr/lib/android-sdk/platforms/android-23/android.jar \
  -F android-build/bin/kaam-wala-unaligned.apk

# 5. Add classes.dex into the APK
echo "-> 5. Adding classes.dex..."
(cd android-build/bin && aapt add kaam-wala-unaligned.apk classes.dex)

# 6. Align APK on 4-byte boundaries
echo "-> 6. Aligning APK with zipalign..."
zipalign -f -v -p 4 android-build/bin/kaam-wala-unaligned.apk android-build/bin/kaam-wala-aligned.apk

# 7. Generate release signing key if it doesn't exist
if [ ! -f "android-build/release.keystore" ]; then
  echo "-> 7. Generating Android release keystore..."
  keytool -genkeypair -v \
    -keystore android-build/release.keystore \
    -alias kaamwala \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass KaamWala2026 \
    -keypass KaamWala2026 \
    -dname "CN=Kaam Wala Pakistan, OU=Mobile, O=Kaam Wala, L=Islamabad, ST=Islamabad, C=PK"
fi

# 8. Sign APK with v1 and v2 signature schemes
echo "-> 8. Signing APK with apksigner (v1 + v2)..."
apksigner sign \
  --ks android-build/release.keystore \
  --ks-pass pass:KaamWala2026 \
  --key-pass pass:KaamWala2026 \
  --out public/downloads/kaam-wala-pakistan.apk \
  android-build/bin/kaam-wala-aligned.apk

# 9. Verify signed APK
echo "-> 9. Verifying APK signature..."
apksigner verify --verbose public/downloads/kaam-wala-pakistan.apk

# 10. Copy to dist
cp public/downloads/kaam-wala-pakistan.apk dist/downloads/kaam-wala-pakistan.apk

echo "=========================================================="
echo "  SUCCESS! APK generated and ready for installation:      "
echo "  File: public/downloads/kaam-wala-pakistan.apk           "
echo "  Size: $(ls -lh public/downloads/kaam-wala-pakistan.apk | awk '{print $5}')"
echo "=========================================================="
