// components/navbar.tsx

"use client";

import Image from "next/image";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Avatar } from "@nextui-org/avatar";
import NextLink from "next/link";
import clsx from "clsx";
import { useSession, signIn, signOut } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  HeartFilledIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const { data: session, status } = useSession();

  const searchInput = <></>;

  return (
      <NextUINavbar maxWidth="xl" position="sticky">
        {/* Left: Brand & Nav links */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex items-center gap-1" href="/">
              <Logo />
              <p className="font-bold">Stock Watch</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 ml-2">
            {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                      className={clsx(
                          "text-inherit",
                          "data-[active=true]:text-primary data-[active=true]:font-medium"
                      )}
                      href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        {/* Right: Icons, search, sponsor, Google auth */}
        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </NavbarItem>

          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

          <NavbarItem className="hidden md:flex">
            <Button
                isExternal
                as={Link}
                className="text-sm font-normal bg-default-100"
                href={siteConfig.links.sponsor}
                startContent={<HeartFilledIcon className="text-danger" />}
                variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem>

          <NavbarItem>
            {status === "loading" ? (
                <span>로딩 중...</span>
            ) : session ? (
                // 로그인 후: 프로필 아바타로 표시 (클릭 시 signOut)
                <Avatar
                    size="sm"
                    src={session.user?.image || ""}
                    alt={session.user?.name || "User"}
                    pointer
                    onClick={() => signOut({ callbackUrl: "/" })}
                />
            ) : (
                // 로그인 전: 구글 로고 + 텍스트
                <Button
                    auto
                    onPress={() => signIn("google", { callbackUrl: "/" })}
                    startContent={
                      <Image
                          src="/google-logo.svg"
                          alt="Google"
                          width={20}
                          height={20}
                      />
                    }
                >
                   Google Login
                </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu>
          {searchInput}
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, i) => (
                <NavbarMenuItem key={i}>
                  <Link
                      color={
                        i === 2
                            ? "primary"
                            : i === siteConfig.navMenuItems.length - 1
                                ? "danger"
                                : "foreground"
                      }
                      href={item.href}
                      size="lg"
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
            ))}
            <NavbarMenuItem>
              {status === "loading" ? (
                  <span>로딩 중...</span>
              ) : session ? (
                  <Avatar
                      size="sm"
                      src={session.user?.image || ""}
                      alt={session.user?.name || "User"}
                      pointer
                      onClick={() => signOut({ callbackUrl: "/" })}
                  />
              ) : (
                  <Button
                      fullWidth
                      onPress={() => signIn("google", { callbackUrl: "/" })}
                      startContent={
                        <Image
                            src="/google-logo.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                      }
                  >
                    구글 로그인
                  </Button>
              )}
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>
  );
};
