import React from 'react';
import { Link } from 'react-router-dom';

// FIX: Replaced `JSX.Element` with `React.ReactElement` to fix 'Cannot find namespace JSX' error.
const FeatureCard = ({ icon, title, description, link }: { icon: React.ReactElement, title: string, description: string, link: string }) => (
  <Link to={link} className="group bg-white p-6 rounded-2xl shadow-soft hover-lift">
    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-sky-100 text-sky-600 mb-4 group-hover:bg-gradient-primary group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-sky-600 transition-colors">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </Link>
);

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center bg-gradient-primary p-12 md:p-16 rounded-3xl shadow-hover animate-fadeIn text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Khám Phá Toán Học</h1>
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
          Bộ công cụ trực quan, mạnh mẽ giúp bạn chinh phục các bài toán phổ thông một cách dễ dàng và hiệu quả.
        </p>
        <Link
          to="/tool/scientific-calculator"
          className="inline-block bg-white text-sky-600 font-bold py-4 px-10 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
        >
          Bắt đầu ngay
        </Link>
      </section>

      <section className="animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">Các công cụ nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <FeatureCard 
            icon={<IconCalculator />}
            title="Máy tính khoa học"
            description="Tính toán nhanh chóng các biểu thức phức tạp, từ cơ bản đến lượng giác, logarit."
            link="/tool/scientific-calculator"
          />
          <FeatureCard 
            icon={<IconTriangle />}
            title="Hệ thức lượng"
            description="Giải tam giác tự động: tính cạnh, góc, diện tích, chu vi chỉ với vài cú nhấp chuột."
            link="/tool/triangle-relations-10"
          />
          <FeatureCard 
            icon={<IconTrigonometry />}
            title="Lượng giác 11"
            description="Tính giá trị và giải các phương trình lượng giác cơ bản một cách chính xác."
            link="/tool/trigonometry-11"
          />
           <FeatureCard 
            icon={<IconGraph />}
            title="Khảo sát Hàm số"
            description="Phân tích và vẽ đồ thị hàm số tự động, tìm cực trị, điểm uốn và hơn thế nữa."
            link="/tool/function-analysis-12"
          />
        </div>
      </section>
    </div>
  );
};

// SVG Icons for features
const IconCalculator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 8h.01M15 8h.01M15 14h.01M18 10a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
);
const IconTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconTrigonometry = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const IconGraph = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

export default HomePage;