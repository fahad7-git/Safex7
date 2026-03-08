import re

file_path = r'c:\Users\fahad\OneDrive\Desktop\Safex7\frontend\src\Pages\Scan.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Loading spinner - add missing closing div
old1 = '''<div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
          )}'''
new1 = '''<div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}'''
content = content.replace(old1, new1)

# Fix 2: Risk score bar - add missing closing div for inner div
old2 = '''style={{ width: scanData.risk_score + "%" }}
                    ></div>

                {scanData.summary}'''
new2 = '''style={{ width: scanData.risk_score + "%" }}
                    ></div>
                  </div>

                {scanData.summary}'''
content = content.replace(old2, new2)

# Fix 3: Grid items - add missing closing div for URL Info
old3 = '''</div>

                  <div className="bg-gray-900 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-green-400 font-bold mb-2 text-sm sm:text-base">Security Status</h4>'''
new3 = '''</div>
                  </div>

                  <div className="bg-gray-900 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-green-400 font-bold mb-2 text-sm sm:text-base">Security Status</h4>'''
content = content.replace(old3, new3)

# Fix 4: Add closing div for Security Status
old4 = '''</div>

                  <div className="bg-gray-900 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-green-400 font-bold mb-2 text-sm sm:text-base">Detection Flags</h4>'''
new4 = '''</div>
                  </div>

                  <div className="bg-gray-900 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-green-400 font-bold mb-2 text-sm sm:text-base">Detection Flags</h4>'''
content = content.replace(old4, new4)

# Fix 5: Results section closing
old5 = '''</div>
          )}

        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 text-gray-500 text-xs sm:text-sm px-2">'''
new5 = '''</div>
          )}

        </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 text-gray-500 text-xs sm:text-sm px-2">'''
content = content.replace(old5, new5)

# Fix 6: Main container closing
old6 = '''</p>
    </div>
  );
}'''
new6 = '''</p>
        </div>
      </div>
    </div>
  );
}'''
content = content.replace(old6, new6)

