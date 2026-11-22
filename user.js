// ═══════════════════════════════════════════════════════════════════════════
// user.js — cấu hình Firefox
//   Base       : Betterfox v154 (đồng bộ 2026-11-20)
//   Chú thích  : tiếng Việt, giải thích trực tiếp từng pref (2026-11-22)
//   Tài liệu   : phan-tich-user.js.md · betterfox-thieu-pref.md
//   Backup     : user.js.v154.bak (trước khi thêm chú thích) · user.js.v142.bak
//
// Nguồn đã quét để viết chú thích:
//   · Betterfox — Fastfox.js / Securefox.js / Peskyfox.js (chú thích gốc của tác giả)
//   · mozilla-central — modules/libpref/init/StaticPrefList.yaml và các file nguồn
//     liên quan, tra qua searchfox.org
//   · Bugzilla 1796525 + 1800412 (EcoQoS cho process tab nền trên Windows 11)
//   · devblogs.microsoft.com/performance-diagnostics/introducing-ecoqos
//   · Các link voz.vn trong file: KHÔNG đọc được nội dung (Cloudflare chặn bot),
//     nên giải thích bên dưới dựa trên hành vi pref, không dựa vào bài viết đó.
//
// Quy ước trong file:
//   (mặc định: X) = giá trị mặc định của Firefox, khi khác giá trị đang đặt
//   [MỚI v154]    = pref Betterfox v154 thêm vào
//   [tùy chỉnh]   = bạn sửa khác Betterfox v154, giữ nguyên có chủ đích
//   [GIỮ LẠI]     = Betterfox v154 đã bỏ khỏi user.js nhưng pref vẫn có tác dụng
//   [ĐÃ BỎ]       = pref Firefox đã gỡ, hoặc đã thành mặc định
//
// 3 điều cần nhớ về user.js:
//   1. Chỉ đọc lúc Firefox khởi động, rồi ghi đè vào prefs.js.
//   2. Pref khai 2 lần thì DÒNG SAU THẮNG.
//   3. Xoá/comment một dòng KHÔNG trả pref về mặc định — giá trị cũ vẫn nằm
//      trong prefs.js. Muốn về mặc định phải Reset trong about:config.
// ═══════════════════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────────────────
// THEME MÀU NỘI DUNG TRANG WEB
// Màu cho NỘI DUNG web (không phải theme toolbar). Chỉ MỘT khối được bật tại
// một thời điểm — khối "Gray Mode" bên dưới đang bật, muốn dùng khối khác thì
// phải comment khối Gray lại, nếu không sẽ không thấy thay đổi gì.
// ───────────────────────────────────────────────────────────────────────────

//Dark Mode style 1 — nền xám đậm #3f3f3f, chữ trắng
/*
user_pref("browser.active_color", "blue");
user_pref("browser.display.background_color", "#3f3f3f");
user_pref("browser.display.foreground_color", "#ffffff");
user_pref("browser.anchor_color", "#ffcc99");
user_pref("browser.visited_color", "#cc99ff");
user_pref("browser.display.document_color_use", 2);
user_pref("browser.display.use_system_colors", false);
user_pref("layout.css.forced-colors.enabled", false);
*/

//Dark Mode style 2 — nền gần đen #121212, dễ chịu hơn khi phòng tối
/*
user_pref("browser.active_color", "blue");
user_pref("browser.display.background_color", "#121212");
user_pref("browser.display.foreground_color", "#ffffff");
user_pref("browser.anchor_color", "#ffcc99");
user_pref("browser.visited_color", "#cc99ff");
user_pref("browser.display.document_color_use", 2);
user_pref("browser.display.use_system_colors", false);
user_pref("layout.css.forced-colors.enabled", false);
*/

//Dark Mode style Dark Reader — bảng màu mô phỏng extension Dark Reader
/*
user_pref("browser.active_color", "blue");
user_pref("browser.display.background_color", "#232627");
user_pref("browser.display.foreground_color", "#E4E3DF");
user_pref("browser.anchor_color", "#92BBDE");
user_pref("browser.visited_color", "#ED944F");
user_pref("browser.display.document_color_use", 2);
user_pref("browser.display.use_system_colors", false);
user_pref("layout.css.forced-colors.enabled", false);
*/

// //Gray Mode — ĐANG BẬT: nền xám sáng #ccc, chữ đen, link đỏ tía
// Màu cho link đang được nhấn giữ (active link).
user_pref("browser.active_color", "#E9967A");
// Màu nền mặc định, chỉ dùng khi trang không tự khai báo màu nền.
user_pref("browser.display.background_color", "#cccccc");
// Màu chữ mặc định, chỉ dùng khi trang không tự khai báo màu chữ.
user_pref("browser.display.foreground_color", "#000000");
// Màu link chưa thăm.
user_pref("browser.anchor_color", "#800040");
// Màu link đã thăm.
user_pref("browser.visited_color", "#b93d00");
// QUAN TRỌNG NHẤT của khối: 0 = luôn dùng màu của trang, 1 = chỉ thay khi trang
// không khai báo, 2 = LUÔN ép màu của bạn lên mọi trang. Để 2 thì nhiều site
// mất giao diện gốc / dark mode riêng, chữ và nền có thể trùng màu.
user_pref("browser.display.document_color_use", 2);
// Không lấy màu từ theme hệ điều hành, dùng các pref màu ở trên.
user_pref("browser.display.use_system_colors", false);
// Tắt chế độ forced-colors (Windows High Contrast) cho nội dung web, để màu
// tự đặt ở trên không bị hệ điều hành ghi đè.
user_pref("layout.css.forced-colors.enabled", false);

//Rust Mode — nền kem #e1e1db
// user_pref("browser.active_color", "#E9967A");
// user_pref("browser.display.background_color", "#e1e1db");
// user_pref("browser.display.foreground_color", "#000000");
// user_pref("browser.anchor_color", "#800040");
// user_pref("browser.visited_color", "#b93d00");
// user_pref("browser.display.document_color_use", 2);
// user_pref("browser.display.use_system_colors", false);
// user_pref("layout.css.forced-colors.enabled", false);

// //Vim Mode — nền xanh lá nhạt #d2e1c8
// user_pref("browser.active_color", "#E9967A");
// user_pref("browser.display.background_color", "#d2e1c8");
// user_pref("browser.display.foreground_color", "#000000");
// user_pref("browser.anchor_color", "#800040");
// user_pref("browser.visited_color", "#b93d00");
// user_pref("browser.display.document_color_use", 2);
// user_pref("browser.display.use_system_colors", false);
// user_pref("layout.css.forced-colors.enabled", false);

//Dark Brown Mode — nền #3f3f3f, chữ be #c9c9bb
// user_pref("browser.active_color", "blue");
// user_pref("browser.display.background_color", "#3f3f3f");
// user_pref("browser.display.foreground_color", "#c9c9bb");
// user_pref("browser.anchor_color", "#dca3a3");
// user_pref("browser.visited_color", "#bba66f");
// user_pref("browser.display.document_color_use", 2);
// user_pref("browser.display.use_system_colors", false);
// user_pref("layout.css.forced-colors.enabled", false);

//
/* You may copy+paste this file and use it as it is.
 *
 * If you make changes to your about:config while the program is running, the
 * changes will be overwritten by the user.js when the application restarts.
 *
 * To make lasting changes to preferences, you will have to edit the user.js.
 */

/****************************************************************************
 * Betterfox                                                                *
 * "Ad meliora"                                                             *
 * version: 154                                                             *
 * url: https://github.com/yokoffing/Betterfox                              *
****************************************************************************/

/****************************************************************************
 * SECTION: FASTFOX                                                         *
 * Mục tiêu: tăng tốc tải trang, giảm reflow, tăng cache và kết nối.        *
****************************************************************************/
/** GENERAL ***/
// Bộ đệm font của Skia (đơn vị MB). Mặc định 5. Tăng lên 20 giúp trang nhiều
// font / typography phức tạp render nhanh hơn, đổi lại tốn thêm RAM.
user_pref("gfx.content.skia-font-cache-size", 20);
// ⚠ [ĐÃ BỎ] Khoảng nghỉ giữa 2 lần reflow khi trang đang tải, tính bằng
// micro-giây (100000 = 0,1 giây). Pref này KHÔNG còn tồn tại trong
// mozilla-central hiện tại (đã kiểm tra searchfox) nên không có tác dụng.
// Giữ lại chỉ vì file user.js chính thức của Betterfox vẫn ship dòng này.
user_pref("content.notify.interval", 100000);

/** GFX ***/
// Kích thước cache bộ nhớ cho Canvas2D tăng tốc phần cứng. Mặc định 256,
// Chrome dùng 512, tối đa 2048. Cao hơn = ít dựng lại canvas hơn, tốn RAM hơn.
user_pref("gfx.canvas.accelerated.cache-size", 512);

/** MEDIA CACHE ***/
// Dừng đọc trước khi phần đã đệm vượt 3600 giây (60 phút) — mặc định 60 giây.
// Chỉ ảnh hưởng video KHÔNG dùng MSE/DASH (thường ≤ 720p); video YouTube,
// Facebook hiện đại không bị ảnh hưởng. Đây là mức của Betterfox v154.
user_pref("media.cache_readahead_limit", 3600);
// Khi mạng bị treo, chỉ kết nối lại lúc buffer tụt dưới 1800 giây (30 phút);
// mặc định 30 giây. Đây là mức của Betterfox v154.
user_pref("media.cache_resume_threshold", 1800);

/** IMAGE CACHE ***/
// Số byte mỗi lần gọi bộ giải mã ảnh. Mặc định 16384; tăng lên giúp giải mã
// ảnh nhanh hơn, tốn CPU/RAM nhiều hơn một chút.
user_pref("image.mem.decode_bytes_at_a_time", 32768);

/** NETWORKING ***/
// Buffer mạng 64 KB thay vì 32 KB (mặc định) — giảm số lần chuyển dữ liệu
// giữa app và driver. [MỚI v154]
user_pref("network.buffer.cache.size", 65535);
// Số buffer dùng đồng thời. Mặc định 24; quá lớn (128) từng gây lỗi file HTML
// > 4 MB. [MỚI v154]
user_pref("network.buffer.cache.count", 48);
// Tổng số kết nối HTTP song song tối đa. Mặc định 900.
user_pref("network.http.max-connections", 1800);
// Số kết nối keep-alive tới MỘT server. Mặc định 6; trên 10 là thừa.
user_pref("network.http.max-persistent-connections-per-server", 10);
// Số kết nối "urgent start" dư thừa cho mỗi host. Mặc định 3.
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
// Giảm độ trễ tối đa trước khi bắt đầu gửi request từ 10 s xuống 5 s. [MỚI v154]
user_pref("network.http.request.max-start-delay", 5);
// Giữ kết quả DNS trong cache 3600 s = 1 giờ (mặc định 60 s). Bị BỎ QUA nếu
// bạn bật DNS-over-HTTPS / TRR.
user_pref("network.dnsCacheExpiration", 3600);

/****************************************************************************
 * SECTION: SECUREFOX                                                       *
 * Mục tiêu: bảo mật + riêng tư vừa phải, không phá web.                    *
****************************************************************************/
/** TRACKING PROTECTION ***/
// Mức Enhanced Tracking Protection. Betterfox gốc dùng "strict" (bật Total
// Cookie Protection, chặn tracker social/email); file này để "standard" →
// chặn ít hơn, ít hỏng site hơn. [tùy chỉnh]
user_pref("browser.contentblocking.category", "standard");
// File mở bằng ứng dụng ngoài sẽ được tải vào thư mục tạm thay vì Downloads
// (FF102+), tránh để rác trong thư mục tải.
user_pref("browser.download.start_downloads_in_tmp_dir", true);
// Tắt backend UITour: trang web không thể yêu cầu Firefox đánh dấu / mở tour
// UI (một vector lừa đảo kiểu "bấm vào đây để bật..."). Không ảnh hưởng gì
// nếu bạn không dùng tính năng tour của Mozilla.
user_pref("browser.uitour.enabled", false);
// Global Privacy Control (FF118+): tín hiệu "đừng bán/chia sẻ dữ liệu của tôi"
// gửi kèm mỗi request. Betterfox v154 bật true; file này tắt false. [tùy chỉnh]
user_pref("privacy.globalprivacycontrol.enabled", false);

/** OCSP & CERTS / HPKP ***/
// Tắt truy vấn OCSP (0=off, 1=on mặc định, 2=chỉ EV). OCSP rò rỉ domain bạn
// truy cập cho CA và hay fail nên Firefox vẫn "soft-fail". Bù lại bằng CRLite.
// Đánh đổi: giảm một lớp kiểm tra chứng chỉ bị thu hồi.
user_pref("security.OCSP.enabled", 0);
// Tài nguyên do content script của extension chèn vào bị cô lập referrer và
// storage (FF139+), tránh việc extension vô tình gắn request vào site. [MỚI v154]
user_pref("privacy.antitracking.isolateContentScriptResources", true);
// Tắt CSP reporting (report-uri / report-to, FF140+): trang không gửi được báo
// cáo vi phạm CSP nữa → bớt một kênh rò rỉ/telemetry do site tự đặt.
user_pref("security.csp.reporting.enabled", false);

/** SSL / TLS ***/
// Coi kết nối không hỗ trợ RFC 5746 (secure renegotiation) là "broken security"
// và hiện cảnh báo. ~99,8% top site đã hỗ trợ; từng làm hỏng login EA.com.
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
// Cho phép trang lỗi chứng chỉ hiện nút "Add Exception" để vẫn bỏ qua được.
// Đây là NỚI LỎNG, hữu ích khi bạn tự quản lý CA / proxy nội bộ.
user_pref("browser.xul.error_pages.expert_bad_cert", true);
// Tắt 0-RTT (TLS 1.3 early data) để chống replay attack; đổi lại lần nối lại
// tốn thêm 1 RTT.
user_pref("security.tls.enable_0rtt_data", false);

/** DISK AVOIDANCE ***/
// Tắt hoàn toàn cache đĩa: không ghi CSS/JS/ảnh xuống SSD (riêng tư hơn, đỡ
// wear SSD) nhưng mỗi lần vào lại site phải tải lại → tốn băng thông, chậm
// hơn khi mạng yếu. v154 chuyển pref này từ Fastfox sang đây.
user_pref("browser.cache.disk.enable", false);
// Media trong cửa sổ Private chỉ nằm trong RAM, không ghi cache media ra đĩa.
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);
// Cache media trong RAM, KB → 64 MB (mặc định 32768 = 32 MB).
user_pref("media.memory_cache_max_size", 65536);
// Chu kỳ ghi session, ms. Mặc định 15000. Ở đây 60000 (1 phút) nhưng sẽ bị
// GHI ĐÈ bởi dòng trong MY OVERRIDES (3600000 = 1 giờ).
user_pref("browser.sessionstore.interval", 60000);

/** SHUTDOWN & SANITIZING ***/
// Đánh dấu "dùng thiết lập lịch sử tùy chỉnh" trong Settings > Privacy, để
// Firefox không tự đổi lại preset mặc định.
user_pref("privacy.history.custom", true);

/** SPECULATIVE LOADING ***/
// v154 chuyển cả nhóm này từ Fastfox sang Securefox. Bản chất: KHÔNG làm nhanh
// hơn, mà đánh đổi tốc độ lấy riêng tư — Firefox không đoán trước bạn sẽ bấm gì.
// Không mở kết nối song song "dự phòng" cho link trên trang, tránh tiết lộ
// trước URL bạn có thể bấm và tiết kiệm kết nối.
user_pref("network.http.speculative-parallel-limit", 0);
// Tắt DNS prefetch cho mọi trang.
user_pref("network.dns.disablePrefetch", true);
// Tắt DNS prefetch cả khi trang là HTTPS (trước đây HTTPS vẫn được prefetch).
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// Không tự mở kết nối tới kết quả đầu tiên trong thanh địa chỉ.
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// Không mở kết nối trước tới bookmark / history.
user_pref("browser.places.speculativeConnect.enabled", false);
// Tắt <link rel="prefetch"> và rel="next" do trang web khai báo.
user_pref("network.prefetch-next", false);

/** SEARCH / URL BAR ***/
// Ẩn "https://" trong thanh địa chỉ (FF127+).
user_pref("browser.urlbar.trimHttps", true);
// Khi bấm vào thanh địa chỉ thì hiện lại URL đầy đủ (gồm https://) để kiểm tra.
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);
// Cho phép đặt search engine riêng cho cửa sổ Private trong Settings.
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);
// Tắt gợi ý tìm kiếm: từng ký tự gõ KHÔNG bị gửi lên search engine. Pref riêng
// tư quan trọng, đánh đổi là mất tính năng gợi ý khi gõ.
user_pref("browser.search.suggest.enabled", false);
// Tắt Firefox Suggest (gợi ý tài trợ / quảng cáo trong dropdown địa chỉ).
user_pref("browser.urlbar.quicksuggest.enabled", false);
// Ẩn nhãn nhóm kết quả ("Firefox Suggest", "Bookmarks"...) trong dropdown.
user_pref("browser.urlbar.groupLabels.enabled", false);
// Tắt autofill form: Firefox không lưu những gì bạn từng gõ vào ô text để gợi
// ý lại sau này.
user_pref("browser.formfill.enable", false);
// Hiển thị tên miền quốc tế ở dạng punycode (xn--...), chống tấn công homograph
// kiểu "аpple" (chữ Cyrillic а) trông giống "apple".
user_pref("network.IDN_show_punycode", true);

/** HTTPS-ONLY MODE ***/
// Chỉ tải trang qua HTTPS: gõ http:// sẽ được nâng lên https:// trước khi vào.
// Pref mới của Betterfox v154 — thay đổi hành vi dễ thấy nhất khi duyệt web.
user_pref("dom.security.https_only_mode", true);                             // [MỚI v154]
// Trang lỗi của HTTPS-Only Mode có hiện gợi ý cho người dùng (nút tiếp tục...).
user_pref("dom.security.https_only_mode_error_page_user_suggestions", true); // [MỚI v154]

/** PASSWORDS ***/
// Không "bắt" mật khẩu từ form không có action / không chuẩn — giảm nguy cơ lưu
// nhầm credential vào site lạ.
user_pref("signon.formlessCapture.enabled", false);
// Không lưu / không đề nghị lưu mật khẩu trong cửa sổ Private Browsing.
user_pref("signon.privateBrowsingCapture.enabled", false);
// Mức cho phép HTTP authentication cho subresource: 0=không bao giờ,
// 1=cho phép (mức mặc định), 2=chỉ same-origin. Để 1 = giữ hành vi mặc định.
user_pref("network.auth.subresource-http-auth-allow", 1);
// Cho phép paste chuỗi dài hơn giới hạn maxlength vào ô nhập (mặc định Firefox
// cắt bớt phần dư).
user_pref("editor.truncate_user_pastes", false);

/** EXTENSIONS ***/
// Bitmask phạm vi add-on được phép bật (1 = profile, 4 = application/system).
// 5 = profile + system. Người dùng thường không thấy khác biệt.
user_pref("extensions.enabledScopes", 5);

/** HEADERS / REFERERS ***/
// Với request khác origin, cắt Referer xuống chỉ còn origin (bỏ path và query),
// tránh lộ URL chi tiết sang site khác.
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

/** VARIOUS ***/
// PDF mở bằng pdf.js không chạy JavaScript (FF86+).
user_pref("pdfjs.enableScripting", false);

/** SAFE BROWSING ***/
// Không gửi metadata file tải về (tên, origin, kích thước, hash) cho Google
// Safe Browsing. Kiểm tra cục bộ (local list) vẫn hoạt động.
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

/** MOZILLA ***/
// Mặc định CHẶN Web Notifications: 0=hỏi, 1=cho phép, 2=chặn.
user_pref("permissions.default.desktop-notification", 2);
// Mặc định CHẶN yêu cầu vị trí: 0=hỏi, 1=cho phép, 2=chặn.
user_pref("permissions.default.geo", 2);
// Đổi dịch vụ định vị: Mozilla Location Service đã ngừng 6/2024, thay bằng
// BeaconDB (dự án cộng đồng). Vô hiệu nếu geo.enabled = false bên dưới.
user_pref("geo.provider.network.url", "https://beacondb.net/v1/geolocate");
// Không tự tải/cập nhật search engine (OpenSearch) → engine bạn đã xoá không
// tự quay lại. Không ảnh hưởng engine có sẵn của Firefox.
user_pref("browser.search.update", false);
// Bỏ bộ quyền mặc định đặc biệt mà Firefox gán cho một số domain Mozilla
// (resource://app/defaults/permissions).
user_pref("permissions.manager.defaultsUrl", "");
// Không cache metadata add-on từ addons.mozilla.org (giảm liên hệ ngầm).
user_pref("extensions.getAddons.cache.enabled", false);

/** TELEMETRY ***/
// Công tắc tổng: không gửi dữ liệu sử dụng nào và không hiện trang policy (FF41+).
user_pref("datareporting.policy.dataSubmissionEnabled", false);
// Không gửi Health Report / technical data.
user_pref("datareporting.healthreport.uploadEnabled", false);
// Tắt telemetry hợp nhất — chỉ khi pref này false thì toolkit.telemetry.enabled
// mới thực sự điều khiển được module telemetry.
user_pref("toolkit.telemetry.unified", false);
// Tắt telemetry (trên bản release pref này vốn đã bị lock = false).
user_pref("toolkit.telemetry.enabled", false);
// Trỏ endpoint telemetry vào URL rỗng: mọi ping "gửi thành công" nhưng không đi đâu.
user_pref("toolkit.telemetry.server", "data:,");
// Không lưu ping vào archive cục bộ (xem được ở about:telemetry).
user_pref("toolkit.telemetry.archive.enabled", false);
// Không gửi ping khi tạo profile mới.
user_pref("toolkit.telemetry.newProfilePing.enabled", false);
// Không gửi ping "shutdown" khi thoát Firefox.
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false);
// Không gửi ping sau khi cập nhật Firefox.
user_pref("toolkit.telemetry.updatePing.enabled", false);
// Tắt Background Hang Reporter — ping khi UI bị treo (FF57+).
user_pref("toolkit.telemetry.bhrPing.enabled", false);
// Không gửi ping ở lần tắt máy đầu tiên sau khi cài.
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false);
// Opt-out khỏi telemetry "coverage" (dùng để đo độ phủ của chính telemetry).
user_pref("toolkit.telemetry.coverage.opt-out", true);
// Như trên, áp cho Firefox nói chung (FF64+).
user_pref("toolkit.coverage.opt-out", true);
// Xoá endpoint của coverage.
user_pref("toolkit.coverage.endpoint.base", "");
// Không telemetry cho feed của trang New Tab.
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
// Tắt telemetry Activity Stream nói chung (New Tab / Home).
user_pref("browser.newtabpage.activity-stream.telemetry", false);
// Tắt báo cáo số người dùng hoạt động hằng ngày (FF136+).
user_pref("datareporting.usage.uploadEnabled", false);

/** EXPERIMENTS ***/
// Không cài và chạy "Studies" (thí nghiệm) của Mozilla.
user_pref("app.shield.optoutstudies.enabled", false);
// Tắt Normandy/Shield — hệ thống có thể đẩy "recipe" thay đổi cấu hình từ xa.
user_pref("app.normandy.enabled", false);
// Xoá endpoint Normandy.
user_pref("app.normandy.api_url", "");
// Tắt remote rollouts của Nimbus (FF148+): Mozilla không bật/tắt tính năng từ
// xa cho profile của bạn nữa. [MỚI v154]
user_pref("nimbus.rollouts.enabled", false);

/** CRASH REPORTS ***/
// Không có URL để gửi crash report.
user_pref("breakpad.reportURL", "");
// Không tự gửi báo cáo khi một tab crash.
user_pref("browser.tabs.crashReporting.sendReport", false);
// Không kiểm tra / không nhắc gửi các crash report còn tồn đọng. [MỚI v154]
user_pref("browser.crashReports.unsubmittedCheck.enabled", false);

/****************************************************************************
 * SECTION: PESKYFOX                                                        *
 * Mục tiêu: bỏ các thứ gây phiền (quảng cáo nội bộ, gợi ý, AI, thông báo). *
****************************************************************************/
/** MOZILLA UI ***/
// Ẩn pane "Recommendations" trong about:addons (pane này dùng Google Analytics).
user_pref("extensions.getAddons.showPane", false);
// Tắt gợi ý extension/theme trong about:addons.
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);
// Tắt gợi ý add-on cá nhân hóa (không có tác dụng khi Health Report đã tắt).
user_pref("browser.discovery.enabled", false);
// Không hỏi "đặt Firefox làm trình duyệt mặc định".
user_pref("browser.shell.checkDefaultBrowser", false);
// Tắt CFR (Contextual Feature Recommender) cho add-on — popup gợi ý cài add-on.
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
// Tắt CFR cho tính năng.
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);
// Ẩn mục "More from Mozilla" trong Settings.
user_pref("browser.preferences.moreFromMozilla", false);
// Bỏ cảnh báo "đây là vùng nguy hiểm" khi mở about:config.
user_pref("browser.aboutConfig.showWarning", false);
// Ghi đè "mốc phiên bản" để Firefox không hiện trang "What's New" sau cập nhật.
user_pref("browser.startup.homepage_override.mstone", "ignore"); // [MỚI v154]
// Không hiện màn hình chào mừng khi tạo profile mới.
user_pref("browser.aboutwelcome.enabled", false);
// Bật profile switcher mới (FF137+) — nhiều profile ngay trong một Firefox.
user_pref("browser.profiles.enabled", true);

/** THEME ADJUSTMENTS ***/
// BẬT userChrome.css / userContent.css — điều kiện bắt buộc để mọi theme CSS
// của Firefox hoạt động.
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// Cho "Compact mode" hiện lại trong Customize Toolbar (Mozilla đã ẩn đi).
user_pref("browser.compactmode.show", true);
// [Windows] Cửa sổ Private không tách nhóm khỏi cửa sổ thường trên taskbar.
user_pref("browser.privateWindowSeparation.enabled", false);

/** AI ***/
// Chặn toàn bộ tính năng AI của Firefox bằng một công tắc tổng. [MỚI v154]
user_pref("browser.ai.control.default", "blocked");
// Tắt engine ML cục bộ.
user_pref("browser.ml.enable", false);
// Tắt chatbot AI ở sidebar.
user_pref("browser.ml.chat.enabled", false);
// Ẩn mục chat AI trong menu. [MỚI v154]
user_pref("browser.ml.chat.menu", false);
// Tắt gợi ý tạo tab group bằng AI. [MỚI v154]
user_pref("browser.tabs.groups.smart.enabled", false);
// Tắt "key points" (tóm tắt bằng AI) trong link preview. [MỚI v154]
user_pref("browser.ml.linkPreview.enabled", false);

/** FULLSCREEN NOTICE ***/
// Bỏ hiệu ứng chuyển khi vào fullscreen (mặc định "200 200" ms).
user_pref("full-screen-api.transition-duration.enter", "0 0");
// Bỏ hiệu ứng khi thoát fullscreen.
user_pref("full-screen-api.transition-duration.leave", "0 0");
// Không hiện banner "Press ESC to exit full screen" (mặc định 3000 ms).
// ⚠ Đánh đổi: mất cảnh báo chống fullscreen giả (clickjacking). Betterfox
// khuyến nghị 1250 nếu bạn lo về bảo mật.
user_pref("full-screen-api.warning.timeout", 0);

/** URL BAR ***/
// Tắt trending search suggestions trong thanh địa chỉ (FF118+).
user_pref("browser.urlbar.trending.featureGate", false);

/** NEW TAB PAGE ***/
// Xoá danh sách shortcut mặc định của New Tab (bạn vẫn tự thêm shortcut được).
user_pref("browser.newtabpage.activity-stream.default.sites", "");
// Không hiện shortcut tài trợ.
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
// Tắt feed "Recommended by Pocket" trên New Tab.
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
// Không hiện sponsored stories.
user_pref("browser.newtabpage.activity-stream.showSponsored", false);
// Ẩn checkbox "Support Firefox" dạng tài trợ (FF140+).
user_pref("browser.newtabpage.activity-stream.showSponsoredCheckboxes", false);

/** DOWNLOADS ***/
// Không thêm file tải về vào danh sách "Recent documents" của Windows.
user_pref("browser.download.manager.addToRecentDocs", false);

/** PDF ***/
// PDF có header Content-Disposition: attachment vẫn được mở ngay trong Firefox
// thay vì bắt tải xuống.
user_pref("browser.download.open_pdf_attachments_inline", true);

/** TAB BEHAVIOR ***/
// Mở bookmark ở tab mới thì không đóng menu bookmark (tiện mở nhiều cái).
user_pref("browser.bookmarks.openInTabClosesMenu", false);
// Findbar tô sáng TẤT CẢ kết quả, không chỉ kết quả đang chọn.
user_pref("findbar.highlightAll", true);

/****************************************************************************
 * SECTION: SMOOTHFOX                                                       *
****************************************************************************/
// visit https://github.com/yokoffing/Betterfox/blob/main/Smoothfox.js
// Mục này đang TRỐNG. Nếu muốn cuộn mượt, chọn MỘT trong 5 option của
// Smoothfox.js (Sharp / Instant / Smooth / Zen / Natural) và dán vào đây.
// Danh sách 14 pref liên quan: xem mục A4 của betterfox-thieu-pref.md.



/****************************************************************************
 * START: MY OVERRIDES                                                      *
 * Phần cá nhân. A = pref Betterfox v154 đã bỏ nhưng vẫn có tác dụng.       *
 * B = tùy chỉnh của bạn. C = pref đã chết / đã thành mặc định (comment).   *
****************************************************************************/
// visit https://github.com/yokoffing/Betterfox/wiki/Common-Overrides
// visit https://github.com/yokoffing/Betterfox/wiki/Optional-Hardening
// Enter your personal overrides below this line:

// ─────────────────────────────────────────────────────────────────────────
// PHẦN A. [GIỮ LẠI] — Betterfox v154 đã bỏ khỏi user.js, nhưng pref vẫn còn
// tác dụng và đang được dùng ở đây. Muốn theo đúng v154 thì xoá cả khối này.
// ─────────────────────────────────────────────────────────────────────────
// Số trang tối đa giữ trong back/forward cache cho mỗi tab. -1 = Firefox tự
// quyết (~8). Giảm còn 4 → ít RAM hơn, back/forward có thể phải tải lại trang.
user_pref("browser.sessionhistory.max_total_viewers", 4);
// Tắt "pacing" request: Firefox gửi request ngay thay vì giãn nhịp. Nhanh hơn
// khi trang có rất nhiều request, nhưng tăng nguy cơ bị server coi là burst.
user_pref("network.http.pacing.requests.enabled", false);
// Tắt bộ dự đoán hành vi mạng (necko predictor) — nó học thói quen duyệt web
// để mở kết nối trước. Tắt = bớt request ngầm, bớt dữ liệu về thói quen.
user_pref("network.predictor.enabled", false);
// Số TLS session token được cache để nối lại nhanh (0-RTT / resumption).
// Mặc định hiện tại ~8192. [tùy chỉnh] giữ 10240.
user_pref("network.ssl_tokens_cache_capacity", 10240);
// Bật cú pháp CSS masonry (grid-template-rows: masonry) — tính năng thử nghiệm,
// chỉ có tác dụng với site chủ động dùng cú pháp này.
user_pref("layout.css.grid-template-masonry-value.enabled", true);
// Chặn cả mixed content dạng HIỂN THỊ (ảnh/iframe http nằm trong trang https),
// không chỉ script. Mạnh hơn mặc định → có thể mất vài ảnh nhúng cũ.
user_pref("security.mixed_content.block_display_content", true);
// Mỗi lần mở Private Browsing là một phiên mới tinh, không khôi phục trạng thái
// / tab private của lần trước.
user_pref("browser.privatebrowsing.resetPBM.enabled", true);
// Bật Multi-Account Containers: tab được cô lập cookie/storage theo container.
user_pref("privacy.userContext.enabled", true);
// Hiện UI container trong Settings (dòng này Betterfox v154 đã bỏ).
user_pref("privacy.userContext.ui.enabled", true);
// Trả lại mục "View Image Info" trong context menu chuột phải trên ảnh.
user_pref("browser.menu.showViewImageInfo", true);
// Double-click chọn từ KHÔNG kèm luôn dấu cách phía sau (giống hành vi macOS).
user_pref("layout.word_select.eat_space_to_next_word", false);

// ─────────────────────────────────────────────────────────────────────────
// PHẦN B. Tùy chỉnh cá nhân (giữ nguyên từ bản v142)
// ─────────────────────────────────────────────────────────────────────────

//Tweaks
//Instant start-up
// [Windows] Tắt skeleton UI (khung cửa sổ xám vẽ sớm trong lúc khởi động).
// Cửa sổ hiện muộn hơn một chút nhưng không bị nháy khung xám.
user_pref("browser.startup.preXulSkeletonUI", false);

//Snappier tooltips
// Độ trễ trước khi tooltip hiện, ms. Mặc định 500 → 60 là gần như tức thì.
user_pref("ui.tooltipDelay", 60);
// Không trễ khi mở submenu.
user_pref("ui.submenuDelay", 0);
// Giảm độ trễ hiện URL đích ở góc dưới khi hover link (mặc định ~250 ms).
user_pref("browser.overlink-delay", 10);

//Enable Alt-Tab-like switch, Ctrl+Tab
// Ctrl+Tab chuyển tab theo THỨ TỰ DÙNG GẦN NHẤT (giống Alt+Tab của Windows)
// thay vì theo thứ tự tab trên thanh.
user_pref("browser.ctrlTab.sortByRecentlyUsed", true);
// user_pref("browser.ctrlTab.sortByRecentlyUsed", false);

// Reduce disk read/write
// Số giây chờ sau khi bạn ngừng thao tác rồi mới ghi session xuống đĩa.
user_pref("browser.sessionstore.idleDelay", 180);
// Ghi session mỗi 1 giờ (mặc định 15 s) — ghi đè giá trị 60000 của SECUREFOX.
// ⚠ RỦI RO: nếu Firefox crash / tắt đột ngột, có thể mất tới ~1 giờ trạng thái
// tab. Đổi về 60000 nếu bạn thường mở nhiều tab quan trọng.
user_pref("browser.sessionstore.interval", 3600000);
//user_pref("browser.sessionstore.collect_zoom", false);
//user_pref("browser.sessionstore.privacy_level", 2);
// Tab đã ghim chỉ được tải khi bạn chọn (giống tab thường) — khôi phục phiên
// nhanh hơn.
user_pref("browser.sessionstore.restore_pinned_tabs_on_demand", true);
//user_pref("browser.sessionhistory.max_total_viewers", 0);

// Disable Accessibility
// Tắt accessibility service của Firefox (nếu bạn không dùng phần mềm hỗ trợ).
// Giảm RAM/CPU; đánh đổi: screen reader / nhập liệu đặc biệt sẽ không hoạt động
// đúng. Cần khởi động lại Firefox.
user_pref("accessibility.force_disabled", 1);

// Disable Taskbar Preview
// user_pref("browser.taskbar.lists.enabled", false);
// user_pref("browser.taskbar.lists.frequent.enabled", false);
// user_pref("browser.taskbar.lists.maxListItemCount", 0);
// user_pref("browser.taskbar.lists.tasks.enabled", false);
// user_pref("browser.taskbar.previews.max", 0);
// //user_pref("browser.taskbar.lists.refreshInSeconds", 2147483647);

// Optimize rendering speed
// https://voz.vn/t/tong-hop-nhung-addon-chat-cho-firefox-pc-mobile.682181/post-23570551
// https://voz.vn/t/tong-hop-nhung-addon-chat-cho-firefox-pc-mobile.682181/post-27064564
// Thời gian Firefox CHỜ trước lần vẽ đầu tiên, ms. 2000 = 2 giây → trang sẽ
// trắng lâu hơn trước khi hiện nội dung, bù lại giảm reflow khi tải.
// ⚠ Betterfox hiện dùng mặc định 5 ms; 250 là mức cân bằng. Đây là pref ảnh
// hưởng cảm giác "nhanh/chậm" rõ nhất trong cả file.
user_pref("nglayout.initialpaint.delay", 2000);
// Như trên, nhưng áp cho iframe khác origin (OOPIF).
user_pref("nglayout.initialpaint.delay_in_oopif", 2000);

// content.notify.* — Firefox hiện tại KHÔNG còn đọc các pref này (đã bị gỡ khỏi
// mã nguồn, đã kiểm tra searchfox). Comment lại để khỏi gây nhiễu about:config.
//user_pref("content.notify.backoffcount", 0);
//user_pref("content.notify.interval", 2000000);
//user_pref("content.notify.ontimer", true);

// Prefer no animation
// https://voz.vn/p/33057189/
// 1 = trình duyệt báo cho web biết prefers-reduced-motion: reduce, đồng thời
// giảm animation của chính UI Firefox → cảm giác nhanh hơn, ít tốn CPU.
user_pref("ui.prefersReducedMotion", 1);

// Maximize bandwidth
// https://voz.vn/p/33049233/
// Chọn thuật toán điều khiển tắc nghẽn (congestion control) cho HTTP/3, đọc
// trong neqo_glue. Theo mô tả Nimbus của Mozilla: 1 = Cubic. Ý nghĩa đầy đủ
// của giá trị 0 chưa kiểm chứng được trong mã neqo.
user_pref("network.http.http3.cc_algorithm", 0);

// Tweak bytecode
// https://voz.vn/p/32603773/
// Mức nén cache bytecode JS (FF102+): 0=không nén (mặc định), 1=tối thiểu,
// 9=tối đa. Để 2 = nén nhẹ, cache nhỏ hơn, tốn chút CPU.
// [tùy chỉnh] Betterfox gợi ý 3.
user_pref("browser.cache.jsbc_compression_level", 2);
// Chiến lược lưu bytecode: -1 = lưu NGAY lần đầu thấy script (lần tải đầu chậm
// hơn, các lần sau nhanh hơn nhiều); 0 = lưu để tối thiểu hoá thời gian load
// (mặc định). [tùy chỉnh]
user_pref("dom.script_loader.bytecode_cache.strategy", -1);
//user_pref("javascript.options.mem.gc_balanced_heap_limits", true);

// Enable old clear history dialog
// Dùng hộp thoại xoá lịch sử kiểu cũ (nhiều tuỳ chọn chi tiết: cache, cookie,
// form data...) thay cho dialog rút gọn mới.
user_pref("privacy.sanitize.useOldClearHistoryDialog", true);

// Disable IPv6
//user_pref("network.dns.disableIPv6", true);

// GoogleDNS
// https://voz.vn/t/tong-hop-nhung-addon-chat-cho-firefox-pc-mobile.682181/post-24688026
//user_pref("network.trr.uri", "https://dns.nextdns.io/");
//user_pref("network.trr.custom_uri", "https://dns.nextdns.io/");
//user_pref("network.trr.mode", 2);

// Enable ECS
//user_pref("network.trr.disable-ECS", false);

// Enable Kyber to access blocked websites
// Bật trao đổi khoá hybrid Kyber/ML-KEM trong TLS 1.3 — chống "store now,
// decrypt later". Trên các bản Firefox gần đây thường đã là mặc định.
user_pref("security.tls.enable_kyber", true);

// Reduce network request
// https://voz.vn/t/tong-hop-nhung-addon-chat-cho-firefox-pc-mobile.682181/post-27409530
// Tắt RCWN (Race Cache With Network): bình thường khi đọc cache chậm, Firefox
// đua thêm request mạng song song. Tắt → ít request trùng hơn, nhưng có thể
// chậm hơn trên ổ đĩa rất chậm.
user_pref("network.http.rcwn.enabled", false);

// Fix Facebook time (ESR <= 115)
// Bật API đo hộp font thật (TextMetrics.fontBoundingBoxAscent/Descent). Site và
// PDF.js dùng nó để căn chữ chính xác; lý do "fix Facebook time" là lịch sử.
user_pref("dom.textMetrics.fontBoundingBox.enabled", true);

// PREF: disable EcoQoS [WINDOWS]
// Background tab processes use efficiency mode on Windows 11 to limit resource use.
// [WARNING] Leave this alone, unless you're on Desktop and you rely on
// background tabs to have maximum performance.
// [1] https://devblogs.microsoft.com/performance-diagnostics/introducing-ecoqos/
// [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1796525
// [3] https://bugzilla.mozilla.org/show_bug.cgi?id=1800412
// [4] https://reddit.com/r/firefox/comments/107fj69/how_can_i_disable_the_efficiency_mode_on_firefox/
// Từ FF108, process của tab nền trên Windows 11 chạy ở EcoQoS (Efficiency
// Mode) để tiết kiệm điện — bug 1796525 đo được có trường hợp giảm 5 lần điện
// năng tiêu thụ của tab nền. Pref này false = TẮT EcoQoS cho tab nền.
// ⚠ Chỉ nên để false nếu bạn là máy desktop và cần tab nền chạy hết tốc lực
// (ví dụ chạy tác vụ trong tab nền); đổi lại máy nóng và tốn điện hơn.
user_pref("dom.ipc.processPriorityManager.backgroundUsesEcoQoS", false);

// Force RAM cache, uncomment // to enable
// https://voz.vn/t/cach-ep-firefox-luu-cache-tren-ram-ma-khong-can-ramdisk.664955/
//user_pref("browser.cache.disk.enable", false);
//user_pref("browser.cache.memory.enable", true);
//user_pref("browser.cache.memory.capacity", 524288);
//user_pref("browser.cache.memory.max_entry_size", 512000);

// Disable FastBack to save RAM
//user_pref("fission.bfcacheInParent", false);
//user_pref("fission.disableSessionHistoryInParent", true);
//user_pref("browser.sessionhistory.max_total_viewers", 0);

// Enable Cookie Banner Protection
//user_pref("cookiebanners.service.mode", 2);
//user_pref("cookiebanners.service.mode.privateBrowsing", 2);

// Disable Restricted Domains
// ⚠ Cho phép add-on chạy trên cả addons.mozilla.org và các trang nội bộ của
// Firefox → tăng bề mặt tấn công (một extension độc có thể đọc/sửa trang quản
// lý add-on). Chỉ giữ nếu bạn thật sự cần.
user_pref("extensions.webextensions.restrictedDomains", "");

// No Animation Fullscreen
// true = VẪN bật animation chuyển fullscreen (chỉ duration bị đưa về 0 ở dòng
// full-screen-api.transition-duration bên dưới). Muốn tắt hẳn thì đổi thành false.
user_pref("browser.fullscreen.animate", true);
// Độ dài hiệu ứng khi VÀO fullscreen, ms (cặp "enter leave"): "0 0" = không hiệu ứng.
user_pref("full-screen-api.transition-duration.enter", "0 0");
// Độ dài hiệu ứng khi THOÁT fullscreen (mặc định "200 200").
user_pref("full-screen-api.transition-duration.leave", "0 0");

// Reader Mode  (lưu ý: comment cũ ghi "Disable" nhưng giá trị là BẬT)
// true = Firefox parse trang để sẵn sàng vào Reader Mode khi tải. Tốn chút CPU;
// nếu không dùng Reader Mode, đổi thành false.
user_pref("reader.parse-on-load.enabled", true);

// Disable Alt Key
// Nhấn phím Alt không còn focus vào menu bar (tránh bật menu khi đang gõ phím
// tắt hoặc chơi game).
user_pref("ui.key.menuAccessKeyFocuses", false);

// Disable Web Notifications
// ⚠ Tắt HẲN Web Notifications API: site không thể xin quyền notification nữa
// (chat web, lịch, một số web app sẽ im lặng). Đây là mức mạnh hơn
// permissions.default.desktop-notification = 2 ở trên.
user_pref("dom.webnotifications.enabled", false);

// Disable Allow Location Access
// ⚠ Tắt HẲN Geolocation API, kể cả site đã được cấp quyền trước đó. Ảnh hưởng
// Google Maps, app giao hàng...
user_pref("geo.enabled", false);

// Enable Compact Mode
// Mật độ UI: 0 = normal, 1 = compact, 2 = touch.
user_pref("browser.uidensity", 1);

// Always show bookmarks bar
// never / newtab / always.
user_pref("browser.toolbars.bookmarks.visibility", "always");

// Tab Preview  (lưu ý: comment cũ ghi "Disable" nhưng giá trị là BẬT)
// true = rê chuột lên tab thì hiện preview nội dung tab (FF122+).
user_pref("browser.tabs.hoverPreview.enabled", true);

// Enable Vertical Tabs
// Tab dọc trong sidebar, và dùng sidebar thế hệ mới (FF136+).
user_pref("sidebar.verticalTabs", true);
// Bật sidebar thế hệ mới (revamp) — điều kiện để tab dọc có đúng giao diện mới.
user_pref("sidebar.revamp", true);
// Đặt sidebar ở BÊN PHẢI (true = bên trái).
user_pref("sidebar.position_start", false);

// Disable Recent Activity
// Tắt mục "Recent Activity" (highlights) trên trang New Tab.
user_pref("browser.newtabpage.activity-stream.feeds.section.highlights", false);

// Disable Tab Groups
// Tắt Tab Groups (FF137+). Nếu bạn đã tạo group, tắt pref này có thể làm group
// biến mất khỏi UI (dữ liệu vẫn nằm trong session).
user_pref("browser.tabs.groups.enabled", false);

// ─────────────────────────────────────────────────────────────────────────
// PHẦN C. [ĐÃ BỎ] — pref v154 đã bỏ và KHÔNG còn tác dụng / đã thành mặc định.
// Giữ ở dạng comment để tra cứu; bật lại cũng không thay đổi gì.
// ─────────────────────────────────────────────────────────────────────────
// CRLite: 0=tắt, 1=chỉ telemetry, 2=áp dụng cả "Revoked" và "Not Revoked".
// Mặc định của Firefox đã là 2 từ v142.
//user_pref("security.pki.crlite_mode", 2);
// Danh sách ngoại lệ ETP "baseline" — mặc định Firefox đã true.
//user_pref("privacy.trackingprotection.allow_list.baseline.enabled", true);
// Danh sách ngoại lệ ETP "convenience" — mặc định Firefox đã true.
//user_pref("privacy.trackingprotection.allow_list.convenience.enabled", true);
// Xoá file tạm khi thoát — mặc định true từ FF108.
//user_pref("browser.helperApps.deleteTempFileOnExit", true);
// URL promo Mozilla VPN trong cửa sổ Private — upstream v154 đã bỏ dòng này.
//user_pref("browser.privatebrowsing.vpnpromourl", "");
// Pocket đã ngừng hoạt động (2025) nên pref không còn ý nghĩa.
//user_pref("extensions.pocket.enabled", false);

/****************************************************************************
 * END: BETTERFOX                                                           *
****************************************************************************/

/****************************************************************************
 * CHANGELOG
 *   2026-11-22  Thêm chú thích tiếng Việt cho từng pref. Không đổi giá trị
 *               nào (đã đối chiếu pref→value với user.js.v154.bak).
 *   2026-11-20  Đồng bộ Betterfox v142 -> v154 (13 pref mới, 8 pref bị bỏ,
 *               1 giá trị đổi theo upstream). Chi tiết: phan-tich-user.js.md §11
 *   Đang giữ theo ý bạn (khác upstream v154):
 *               browser.contentblocking.category "standard" (upstream "strict")
 *               privacy.globalprivacycontrol.enabled false (upstream true)
 *   Đã đưa về đúng mức upstream v154: media.cache_readahead_limit 3600,
 *               media.cache_resume_threshold 1800
 ****************************************************************************/
