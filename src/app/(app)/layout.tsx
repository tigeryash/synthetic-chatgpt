import DisplaySidebar from "@/components/display-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <DisplaySidebar />

      <div className="bg-[#212121] h-full flex-1 flex flex-col z-10 transition-all duration-300 ease-in-out">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
