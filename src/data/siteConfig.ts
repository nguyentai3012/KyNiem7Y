export interface MemoryChapter {
  year: string;
  date: string;
  title: string;
  note: string;
  image: string;
  fallbackImage: string;
}

const LOCAL_FALLBACK_IMAGE = '/photos/file_00000000d934720c8f44ad66b1bbca8b.png';

export const anniversaryConfig = {
  herName: 'Bé iu của anh',
  fromName: 'Anh của em',
  startDate: '2019-09-25T00:00:00+07:00',
  anniversaryDate: '25.09.2026',
  songUrl: '/photos/Ng%C3%A0y%20%C4%90%E1%BA%A7u%20Ti%C3%AAn.mp3',
  headline: '7 năm rồi, người bên cạnh anh vẫn là em.',
  intro:
    'Từ một cái gật đầu vào ngày 25.09.2019, chúng mình đã đi cùng nhau qua những ngày rất vui, những ngày chẳng dễ dàng, và cả những điều nhỏ bé mà chỉ hai đứa mới hiểu.',
  letter: [
    'Hôm nay là tròn 7 năm kể từ ngày em đồng ý cùng anh bắt đầu câu chuyện của chúng mình.',
    'Bảy năm nghe thì dài, nhưng khi nhìn lại anh vẫn thấy mọi thứ trôi qua thật nhanh. Từ hai đứa còn vụng về chẳng biết phải yêu một người như thế nào, đến hôm nay anh vẫn thấy may vì người ở cạnh mình vẫn là em.',
    'Cảm ơn em vì đã ở đó trong những ngày anh vui nhất, cả những lúc anh mệt mỏi và khó chịu nhất. Cảm ơn vì những lần nhường nhịn, những câu hỏi han rất bình thường, những buổi đi đâu đó chẳng cần kế hoạch và cả những khoảnh khắc chẳng làm gì cả mà vẫn thấy bình yên.',
    'Anh không biết 10 năm, 20 năm sau chúng mình sẽ thay đổi ra sao. Anh chỉ mong khi nhìn lại, hai đứa vẫn có thể cười và nói rằng: may quá, hồi đó mình đã không buông tay nhau.',
    'Chúc mừng kỷ niệm 7 năm của chúng mình. Anh vẫn yêu em, theo cách trưởng thành hơn ngày đầu một chút, nhưng vẫn muốn người đi cùng anh trong những năm tiếp theo là em.'
  ],
  memories: [
    {
      year: '2019',
      date: '25.09.2019',
      title: 'Ngày chúng mình bắt đầu',
      note: 'Một cái gật đầu, hai đứa còn ngại ngùng, và một câu chuyện mà lúc đó chẳng ai biết sẽ đi được xa đến thế nào.',
      image: '/photos/FB_IMG_1556690572974.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2020',
      date: '2020',
      title: 'Năm đầu tiên bên nhau',
      note: 'Dần hiểu những thói quen rất nhỏ của nhau, biết cách làm nhau vui và cũng bắt đầu học cách làm hòa.',
      image: '/photos/FB_IMG_1558628801132.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2021',
      date: '2021',
      title: 'Những chuyến đi đầu tiên',
      note: 'Đi đâu không quan trọng bằng chuyện người ngồi cạnh mình là ai. Những tấm hình này là bằng chứng chúng mình đã có một thời thật trẻ.',
      image: '/photos/IMG_20210418_175705.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2022',
      date: '2022',
      title: 'Bình yên thành một thói quen',
      note: 'Có những ngày chẳng cần điều gì đặc biệt. Chỉ cần biết cuối ngày vẫn có một người để kể chuyện là đủ.',
      image: '/photos/FB_IMG_1668072563655.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2023',
      date: '2023',
      title: 'Cùng nhau trưởng thành',
      note: 'Mỗi người có thêm những lo toan riêng, nhưng chúng mình vẫn cố chừa một chỗ cho nhau trong cuộc sống bận rộn.',
      image: '/photos/MVIMG_20240212_193348.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2024',
      date: '2024',
      title: 'Những ngày không hoàn hảo',
      note: 'Không phải ngày nào cũng ngọt ngào. Nhưng có lẽ điều đáng quý nhất là sau những lần không hiểu nhau, hai đứa vẫn chọn nói chuyện và ở lại.',
      image: '/photos/MVIMG_20240418_203701.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2025',
      date: '2025',
      title: 'Vẫn thích đi cạnh nhau',
      note: 'Sau từng ấy thời gian, một buổi hẹn bình thường, một ly nước hay một đoạn đường cùng về vẫn là những điều anh muốn giữ.',
      image: '/photos/IMG_20250925_202855.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    },
    {
      year: '2026',
      date: '25.09.2026',
      title: 'Và hôm nay — 7 năm',
      note: 'Không phải kết thúc của một hành trình. Chỉ là một dấu mốc để hai đứa nhìn lại, mỉm cười, rồi tiếp tục đi về phía trước.',
      image: '/photos/IMG_20260606_182002.jpg',
      fallbackImage: LOCAL_FALLBACK_IMAGE
    }
  ] satisfies MemoryChapter[]
};
