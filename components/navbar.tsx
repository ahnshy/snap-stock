// components/navbar.tsx

"use client";

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
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useSession, signIn, signOut } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const { data: session, status } = useSession();

  const searchInput = (
      <></>
  );

  return (
      <NextUINavbar maxWidth="xl" position="sticky">
        {/* Left: Brand & Nav links */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/">
              <Logo />
              <p className="font-bold text-inherit">ahnshy</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                      className={clsx(
                          linkStyles({ color: "foreground" }),
                          "data-[active=true]:text-primary data-[active=true]:font-medium",
                      )}
                      href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        {/* Center / Right: Icons, search, sponsor, and Google login */}
        <NavbarContent
            className="hidden sm:flex basis-1/5 sm:basis-full"
            justify="end"
        >
          {/* Social & Theme */}
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </NavbarItem>

          {/* (Optional) Search input */}
          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

          {/* Sponsor button */}
          <NavbarItem className="hidden md:flex">
            <Button
                isExternal
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={siteConfig.links.sponsor}
                startContent={<HeartFilledIcon className="text-danger" />}
                variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem>

          {/* Google Login / Logout */}
          <NavbarItem>
            {status === "loading" ? (
                <span>로딩 중...</span>
            ) : session ? (
                <Button auto flat onPress={() => signOut({ callbackUrl: "/" })}>
                  로그아웃
                </Button>
            ) : (
                <Button auto onPress={() => signIn("google", { callbackUrl: "/" })}>
                  구글 로그인
                </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        {/* Mobile: Icons & menu toggle */}
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
            {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                      color={
                        index === 2
                            ? "primary"
                            : index === siteConfig.navMenuItems.length - 1
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
            {/* Mobile: also include login/logout */}
            <NavbarMenuItem>
              {status === "loading" ? (
                  <span>로딩 중...</span>
              ) : session ? (
                  <Button fullWidth flat onPress={() => signOut({ callbackUrl: "/" })}>
                    로그아웃
                  </Button>
              ) : (
                  <Button fullWidth onPress={() => signIn("google", { callbackUrl: "/" })}>
                    구글 로그인
                  </Button>
              )}
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>
  );
};
