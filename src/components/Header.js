"use client"; 
import { usePathname  } from "next/navigation";
import Link from "next/link";
import { Menu } from "antd";
import { motion } from "framer-motion";

const Header = () => {
  const currentPath = usePathname();
  const menuItems = [
    {
      key: "/",
      label: <Link href="/">Home</Link>,
    },
    {
      key: "/xp",
      label: <Link href="/xp">XP</Link>,
    },
    {
      key: "/portfolio",
      label: <Link href="/portfolio">Portfolio</Link>,
    },
  ];
    return (
      <header
        className="header fixed top-0 left-1/2 transform -translate-x-1/2 w-full p-4 z-50"
      >
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]} // Active state
          items={menuItems} // Use `items` prop instead of `children`
          className="bg-transparent border-none flex justify-center font-semibold"
        />
      </header>
    );
  };

export default Header;
