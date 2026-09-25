import { LoveMilestone, MemoryPhoto, LoveCoupon, LoveLetterData, CoupleSettings } from '../types.ts';

export const defaultSettings: CoupleSettings = {
  startDate: '2019-09-25T00:00:00',
  herName: 'Em',
  hisName: 'Anh',
  herNickname: 'Bé Yêu Của Anh',
  hisNickname: 'Người Yêu Của Em',
  anniversaryMessage: 'Chúc mừng 7 năm chúng mình bên nhau (25/09/2019 - 25/09/2026)! Cảm ơn em vì đã luôn là điều dịu dàng nhất trong cuộc đời anh.'
};

export const defaultMilestones: LoveMilestone[] = [
  {
    id: 'm1',
    year: '2019',
    date: '25/09/2019',
    title: 'Cái Gật Đầu Ngọt Ngào Nhất',
    description: 'Ngày anh gom hết can đảm để nói lời yêu và nhận được nụ cười bẽn lẽn cùng cái gật đầu của em. Bắt đầu một chương rực rỡ nhất trong cuộc đời.',
    category: 'Khởi đầu',
    iconName: 'heart'
  },
  {
    id: 'm2',
    year: '2020',
    date: '14/02/2020',
    title: 'Mùa Valentine Đầu Tiên',
    description: 'Bó hoa nhỏ, hộp quà tự gói vụng về nhưng ánh mắt em lấp lánh hạnh phúc. Đó là lần đầu tiên chúng mình nhận ra hai tâm hồn đồng điệu đến nhường nào.',
    category: 'Kỷ niệm',
    iconName: 'gift'
  },
  {
    id: 'm3',
    year: '2021',
    date: '25/09/2021',
    title: 'Tròn 2 Năm & Vượt Qua Khoảng Cách',
    description: 'Dù có những ngày bận rộn hay xa nhau vì học tập công việc, từng cuộc gọi đêm muộn và tin nhắn chúc ngủ ngon đã giữ ngọn lửa yêu thương luôn ấm áp.',
    category: 'Vững tin',
    iconName: 'sparkles'
  },
  {
    id: 'm4',
    year: '2022',
    date: '10/07/2022',
    title: 'Chuyến Đi Xa Cùng Nhau',
    description: 'Cùng nhau ngắm bình minh trên đỉnh núi mây mù, lang thang qua từng con phố nhỏ và chia nhau ly trà sữa ấm. Thế giới bỗng hóa bình yên khi có em kề bên.',
    category: 'Hành trình',
    iconName: 'compass'
  },
  {
    id: 'm5',
    year: '2023',
    date: '25/09/2023',
    title: 'Mốc 4 Năm - Thấu Hiểu Từng Thói Quen',
    description: 'Không cần nói thành lời cũng biết người kia đang nghĩ gì hay muốn ăn món gì. Tình yêu đã chuyển hóa thành sự bình yên và tin tưởng tuyệt đối.',
    category: 'Gắn kết',
    iconName: 'coffee'
  },
  {
    id: 'm6',
    year: '2024',
    date: '18/11/2024',
    title: 'Tựa Vào Vai Nhau Qua Thử Thách',
    description: 'Những áp lực của công việc và cuộc sống dường như tan biến khi được về nhà, ôm em một cái thật chặt và nghe tiếng cười giòn tan quen thuộc.',
    category: 'Điểm tựa',
    iconName: 'shield'
  },
  {
    id: 'm7',
    year: '2025',
    date: '25/09/2025',
    title: 'Năm Thứ 6 - Cùng Nhau Xây Đắp Ước Mơ',
    description: 'Cùng nhau lên kế hoạch cho một tương lai dài lâu, một mái ấm nhỏ ngập tràn ánh nắng và tiếng cười, nơi có anh và có em mỗi sớm mai thức dậy.',
    category: 'Tương lai',
    iconName: 'home'
  },
  {
    id: 'm8',
    year: '2026',
    date: '25/09/2026',
    title: 'Tròn 7 Năm Yêu Nhau - Mãi Mãi Một Tình Yêu',
    description: '2,557 ngày cùng nhau đi qua nắng mưa. 7 năm không phải một chặng đường ngắn, nhưng với anh, tình yêu dành cho em vẫn vẹn nguyên và ngày một sâu đậm hơn.',
    category: 'Hiện tại',
    iconName: 'infinity'
  }
];

export const defaultLetter: LoveLetterData = {
  recipient: 'Bé yêu của anh',
  sender: 'Người yêu em nhất trần đời',
  salutation: 'Gửi người con gái anh yêu nhất,',
  title: 'Thư Kỷ Niệm 7 Năm Yêu Nhau (25/09/2019 - 25/09/2026)',
  paragraphs: [
    'Thời gian trôi nhanh như một cái chớp mắt, ngày mai là tròn 7 năm kể từ ngày 25 tháng 9 năm 2019 — ngày mà anh may mắn nhất trên đời khi được em trao cho bàn tay ấm áp và nụ cười rạng rỡ ấy.',
    '2,557 ngày qua, chúng mình đã cùng nhau nếm trải bao nhiêu cung bậc: những tiếng cười ròn rã lúc dạo phố đêm, những bữa ăn giản dị bên nhau, và cả những lúc giận hờn vu vơ để rồi càng thêm thấu hiểu và thương nhau nhiều hơn.',
    'Cảm ơn em vì đã luôn kiên nhẫn, dịu dàng và là bến đỗ bình yên nhất mỗi khi anh mệt mỏi giữa bộn bề cuộc sống. Cảm ơn em vì mỗi buổi sáng thức dậy hay đêm muộn, trong tim anh luôn có một người đặc biệt để hướng về.',
    '7 năm qua chỉ mới là sự khởi đầu cho một hành trình cả đời. Dù mai này cuộc sống có đổi thay, mái tóc có ngả màu sương gió, anh vẫn muốn được nắm tay em, cùng em đi qua thêm nhiều mùa thu nữa, che chở và yêu thương em bằng tất cả những gì anh có.',
    'Chúc mừng ngày kỷ niệm của hai chúng mình. Yêu em hôm qua, hôm nay, ngày mai và mãi mãi về sau!'
  ],
  quote: '“Người ta bảo tình yêu 7 năm là một thử thách lớn, nhưng với anh, 7 năm chỉ chứng minh rằng trái tim này sinh ra là để yêu em trọn đời.”',
  closing: 'Thương em vô hạn,',
  signatureDate: '25 tháng 09 năm 2026'
};

export const defaultCoupons: LoveCoupon[] = [
  {
    id: 'c1',
    title: 'Phiếu Hết Dỗi Vô Điều Kiện',
    description: 'Khi xuất trình phiếu này, anh sẽ lập tức nhận lỗi, ôm em thật chặt và dỗ dành em bằng mọi giá, không được cãi một câu!',
    condition: 'Có hiệu lực trọn đời · Dùng bất cứ khi nào em cảm thấy dỗi anh',
    code: 'LOVE-NO-POUT-01',
    isRedeemed: false,
    badge: 'Đặc Quyền Của Nàng'
  },
  {
    id: 'c2',
    title: 'Một Bữa Ăn Theo Ý Em (Anh Bao)',
    description: 'Em muốn ăn món gì, ở đâu, đắt hay rẻ tùy thích, anh sẽ là tài xế kiêm phục vụ kiêm thanh toán 100% không phàn nàn.',
    condition: 'Áp dụng cho mọi nhà hàng hoặc món ăn em thèm',
    code: 'LOVE-FEAST-02',
    isRedeemed: false,
    badge: 'Mỹ Vị Tình Yêu'
  },
  {
    id: 'c3',
    title: 'Massage Thư Giãn 30 Phút',
    description: 'Dịch vụ massage vai, lưng và chân chuẩn 5 sao từ đôi bàn tay của anh bất cứ khi nào em thấy mỏi mệt sau ngày dài làm việc.',
    condition: 'Đi kèm tinh dầu và âm nhạc nhẹ nhàng thư giãn',
    code: 'LOVE-SPA-03',
    isRedeemed: false,
    badge: 'Chăm Sóc Tận Tâm'
  },
  {
    id: 'c4',
    title: 'Một Cái Ôm Thật Chặt & Lắng Nghe',
    description: 'Một cái ôm ấm áp không buông và lắng nghe em trút bầu tâm sự mọi chuyện trên đời mà không hề phán xét hay ngắt lời.',
    condition: 'Không giới hạn thời gian ôm',
    code: 'LOVE-HUG-04',
    isRedeemed: false,
    badge: 'Ấm Áp Bình Yên'
  },
  {
    id: 'c5',
    title: 'Ngày Làm Việc Nhà & Nấu Ăn Thay Em',
    description: 'Anh nhận trọn gói: giặt đồ, dọn dẹp phòng, rửa bát và nấu món canh em thích nhất, để em chỉ việc nằm xem phim thư giãn.',
    condition: 'Áp dụng cho một ngày trọn vẹn',
    code: 'LOVE-HOUSEKEEP-05',
    isRedeemed: false,
    badge: 'Chàng Trai Đảm Đang'
  },
  {
    id: 'c6',
    title: 'Chuyến Đi Trốn Cuối Tuần 2 Người',
    description: 'Một chuyến dã ngoại hoặc về vùng ngoại ô trong lành cùng nhau hít thở khí trời, tạm gác lại deadline và sự ồn ào của phố thị.',
    condition: 'Lên lịch bất cứ cuối tuần nào em muốn',
    code: 'LOVE-GETAWAY-06',
    isRedeemed: false,
    badge: 'Hành Trình Ngọt Ngào'
  }
];

export const defaultPhotos: MemoryPhoto[] = [
  {
    id: 'p1',
    title: 'Buổi Hẹn Đầu Tiên',
    date: 'Thu 2019',
    location: 'Quán cà phê góc phố quen',
    note: 'Hôm ấy em mặc chiếc áo trắng xinh xắn, hai đứa bối rối chẳng dám nhìn thẳng vào mắt nhau lâu, nhưng ly cà phê hôm ấy ngọt ngào lạ kỳ.',
    svgPreset: 'cafe',
    rotation: -2
  },
  {
    id: 'p2',
    title: 'Đêm Hoàng Hôn Bên Biển',
    date: 'Mùa Hè 2021',
    location: 'Bờ biển sóng vỗ rì rào',
    note: 'Khi ánh hoàng hôn cam vàng rực rỡ buông xuống, em tựa đầu vào vai anh và bảo: "Ước gì thời gian ngừng trôi ở khoảnh khắc này".',
    svgPreset: 'sunset',
    rotation: 3
  },
  {
    id: 'p3',
    title: 'Cơn Mưa Rào & Chiếc Ô Nhỏ',
    date: 'Mùa Mưa 2022',
    location: 'Góc phố dưới tán cây xanh',
    note: 'Chiếc ô bé xíu chỉ đủ cho một người, anh nghiêng hẳn ô về phía em để em không bị ướt, còn vai áo anh ướt sũng nhưng tim lại ấm sực.',
    svgPreset: 'rain',
    rotation: -1.5
  },
  {
    id: 'p4',
    title: 'Những Bữa Cơm Tự Nấu',
    date: 'Mùa Đông 2023',
    location: 'Góc bếp nhỏ ấm cúng',
    note: 'Em nêm món canh hơi nhạt một xíu, anh lỡ tay làm cháy mép trứng chiên, thế mà hai đứa ăn ngon lành và cười vang cả gian phòng.',
    svgPreset: 'kitchen',
    rotation: 2.5
  },
  {
    id: 'p5',
    title: 'Chạm Đỉnh Núi Mờ Sương',
    date: 'Mùa Xuân 2024',
    location: 'Đồi chè & Sương sớm mây phủ',
    note: 'Cùng nhau vượt qua đoạn dốc dài mệt đứt hơi, để rồi khi đứng trên cao đón gió sớm mát lạnh, anh biết có em bên cạnh anh chẳng sợ bất cứ chông gai nào.',
    svgPreset: 'mountain',
    rotation: -3
  },
  {
    id: 'p6',
    title: 'Bình Yên Dưới Bầu Trời Đầy Sao',
    date: 'Mùa Thu 2025',
    location: 'Khu cắm trại đồi thông',
    note: 'Nằm bên nhau ngắm dải ngân hà lấp lánh, anh ước một điều ước duy nhất: ước cho nụ cười trên môi em sẽ luôn rạng rỡ suốt những năm tháng về sau.',
    svgPreset: 'stars',
    rotation: 1.8
  }
];

export const loveQuizItems = [
  {
    id: 'q1',
    question: 'Điều gì ở em khiến anh say đắm nhất?',
    options: ['Nụ cười tỏa nắng', 'Ánh mắt dịu dàng', 'Sự quan tâm chân thành', 'Tất cả mọi điều thuộc về em!'],
    correctIndex: 3,
    reaction: 'Chính xác 100%! Dù là nụ cười, giọng nói hay lúc em làm nũng, tất cả những gì thuộc về em đều là điều hoàn hảo nhất trong mắt anh.'
  },
  {
    id: 'q2',
    question: 'Chúng mình đã cùng nhau đi qua bao nhiêu mùa thu rồi?',
    options: ['5 mùa thu', '6 mùa thu', '7 mùa thu tròn trĩnh!', 'Không đếm xuể'],
    correctIndex: 2,
    reaction: 'Tròn 7 mùa thu vàng (2019 - 2026)! Mỗi mùa thu qua đi, tình yêu của anh dành cho em lại càng thêm đong đầy.'
  },
  {
    id: 'q3',
    question: 'Món ăn nào em nấu mà anh nhớ nhất?',
    options: ['Món nào em nấu anh cũng thích', 'Món canh sườn ấm bụng', 'Đĩa mì xào đêm muộn', 'Ly nước ép em tự tay chuẩn bị'],
    correctIndex: 0,
    reaction: 'Chỉ cần là em nấu với tất cả yêu thương, với anh đó đều là sơn hào hải vị ngon nhất trên đời!'
  },
  {
    id: 'q4',
    question: 'Kế hoạch lớn nhất của anh trong tương lai là gì?',
    options: ['Du lịch khắp năm châu', 'Cùng em già đi trong hạnh phúc', 'Mua thật nhiều trà sữa cho em', 'Cả 3 điều trên luôn!'],
    correctIndex: 3,
    reaction: 'Tuyệt đối chính xác! Đưa em đi khắp nơi, chiều chuộng em và cùng em già đi bên một mái nhà tràn ngập yêu thương.'
  }
];
