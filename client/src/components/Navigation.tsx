"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Navigation.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/volunteers", label: "Voluntarios", icon: "👥" },
  { href: "/members", label: "Socios", icon: "👤" },
  { href: "/shifts", label: "Turnos", icon: "📅" },
  { href: "/donations", label: "Donaciones", icon: "💰" },
  { href: "/activities", label: "Actividades", icon: "🎯" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav ref={navRef} className={styles.navContainer}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏢</span>
          <h1 className={styles.logoText}>Luntia</h1>
        </Link>

        <ul className={styles.navMenu}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${
                  pathname === item.href ? styles.active : ""
                }`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className={styles.mobileMenuButton}
          aria-label="Toggle menu"
        >
          <span style={{ fontSize: "20px" }}>
            {isMobileMenuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${styles.open}`}>
          <ul className={styles.mobileMenuList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.mobileMenuLink} ${
                    pathname === item.href ? styles.active : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className={styles.mobileMenuIcon}>{item.icon}</span>
                  <span className={styles.mobileMenuText}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
