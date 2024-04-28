import DisplaySidebar from "@/components/display-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <DisplaySidebar />
      <div className="bg-[#212121] flex-1 flex h-screen flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
