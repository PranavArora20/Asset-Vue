// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import ThemeSwitch from "../components/ThemeSwitch"; // Dark/Light toggle

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const location = useLocation();

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedKey =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "portfolio",
      label: <Link to="/portfolio">Portfolio</Link>,
    },
    {
      key: "compare",
      label: <Link to="/compare">Compare</Link>,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "linear-gradient(90deg, #001529, #003b73)",
        height: "60px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo + Brand */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "40px",
              marginRight: "10px",
              borderRadius: "50%",
              background: "transparent",
            }}
          />
          <h2 style={{ color: "#00E6A8", margin: 0, fontWeight: "bold" }}>
            AssetVue
          </h2>
        </div>
      </Link>

      {/* Desktop Navbar */}
      {!isMobile ? (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{
              background: "transparent",
              borderBottom: "none",
              fontSize: "16px",
              fontWeight: "500",
              display: "flex",
              gap: "20px",
            }}
          />
          <ThemeSwitch />
        </div>
      ) : (
        // Mobile Drawer
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: "24px", color: "white" }} />}
            onClick={() => setDrawerOpen(true)}
          />
          <Drawer
            title="AssetVue"
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="vertical"
              selectedKeys={[selectedKey]}
              onClick={() => setDrawerOpen(false)}
              items={menuItems}
              style={{ borderRight: "none", fontSize: "16px" }}
            />
            <div style={{ padding: "10px 20px" }}>
              <ThemeSwitch />
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
}
