import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ProfileView } from "./ProfileView";
import React from "react";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }
  ) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

// Mock framer-motion to avoid hoisting/animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    a: ({ children, ...props }: { children?: React.ReactNode }) => (
      <a {...props}>{children}</a>
    ),
    h1: ({ children, ...props }: { children?: React.ReactNode }) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: { children?: React.ReactNode }) => (
      <h2 {...props}>{children}</h2>
    ),
    p: ({ children, ...props }: { children?: React.ReactNode }) => (
      <p {...props}>{children}</p>
    ),
    span: ({ children, ...props }: { children?: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock phosphorus icons
vi.mock("@phosphor-icons/react", () => ({
  ArrowRight: () => <svg data-testid="arrow-right" />,
  ArrowUpRight: () => <svg data-testid="arrow-up-right" />,
  Envelope: () => <svg data-testid="envelope" />,
  MapPin: () => <svg data-testid="map-pin" />,
  Phone: () => <svg data-testid="phone" />,
}));

// Mock ThemeToggle
vi.mock("./common/themeToggle", () => ({
  ThemeToggle: () => <button>ThemeToggle</button>,
}));

// Mock ScrollArea
vi.mock("../src/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockProfile = {
  id: "1",
  displayName: "John Doe",
  heroKicker: "Welcome",
  heroHeadline: "Main Hero",
  heroDescription: "Hero Desc",
  headline: "Profile Headline",
  bio: "This is my bio",
  avatarUrl: "avatar.png",
  bannerUrl: "banner.png",
  professionalCategory: "Software Engineer",
  location: "New York",
  companyName: "Tech Corp",
  whatsapp: "123456789",
  whatsappMessage: "Hello",
  publicEmail: "john@example.com",
  publicPhone: "987654321",
  primaryCtaLabel: "Primary Action",
  primaryCtaUrl: "https://primary.com",
  secondaryCtaLabel: "Secondary Action",
  secondaryCtaUrl: "https://secondary.com",
  themeAccent: "#ff0000",
  slug: "john-doe",
  MaguiConnectLink: [
    {
      id: "link1",
      label: "Instagram",
      url: "https://instagram.com/john",
      customShortDescription: "Follow me on Insta",
      kind: "INSTAGRAM",
      startsAt: null,
      expiresAt: null,
      isFeatured: false,
      isActive: true,
      openInNewTab: true,
      sectionId: null,
    },
  ],
  MaguiConnectSection: [
    {
      id: "sec1",
      title: "My Projects",
      description: "List of projects",
      isCollapsible: false,
      isActive: true,
      MaguiConnectLink: [
        {
          id: "link2",
          label: "GitHub",
          url: "https://github.com/john",
          customShortDescription: null,
          kind: "GITHUB",
          startsAt: null,
          expiresAt: null,
          isFeatured: true,
          isActive: true,
          openInNewTab: true,
          sectionId: "sec1",
        },
      ],
    },
  ],
};

describe("ProfileView Component", () => {
  test("renders basic profile information", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Profile Headline")).toBeInTheDocument();
    expect(screen.getByText("This is my bio")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
  });

  test("renders CTAs", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("Primary Action")).toBeInTheDocument();
    expect(screen.getByText("Secondary Action")).toBeInTheDocument();
  });

  test("renders quick actions", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  test("renders hero section in banner", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Main Hero")).toBeInTheDocument();
    expect(screen.getByText("Hero Desc")).toBeInTheDocument();
  });

  test("renders top level links", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Follow me on Insta")).toBeInTheDocument();
  });

  test("renders sections and section links", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("My Projects")).toBeInTheDocument();
    expect(screen.getByText("List of projects")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  test("renders empty state when no content is provided", () => {
    const emptyProfile = {
      ...mockProfile,
      bio: null,
      headline: null,
      heroHeadline: null,
      heroDescription: null,
      whatsapp: null,
      publicEmail: null,
      publicPhone: null,
      primaryCtaUrl: null,
      secondaryCtaUrl: null,
      avatarUrl: null,
      bannerUrl: null,
      MaguiConnectLink: [],
      MaguiConnectSection: [],
    };
    render(<ProfileView profile={emptyProfile} />);
    expect(screen.getByText("Em Breve")).toBeInTheDocument();
    expect(
      screen.getByText(/Estamos preparando algo especial/)
    ).toBeInTheDocument();
  });

  describe("Icon Mapping (30+ tests)", () => {
    const iconTests = [
      {
        kind: "INSTAGRAM",
        url: "https://instagram.com",
        expected: "/icons/Instagram.svg",
      },
      {
        kind: "LINKEDIN",
        url: "https://linkedin.com",
        expected: "/icons/LinkedIn.svg",
      },
      {
        kind: "YOUTUBE",
        url: "https://youtube.com",
        expected: "/icons/Youtube.svg",
      },
      { kind: "X", url: "https://x.com", expected: "/icons/X.svg" },
      { kind: "TWITTER", url: "https://twitter.com", expected: "/icons/X.svg" },
      {
        kind: "TIKTOK",
        url: "https://tiktok.com",
        expected: "/icons/Tiktok.svg",
      },
      {
        kind: "WHATSAPP",
        url: "https://wa.me",
        expected: "/icons/Whatsapp.svg",
      },
      {
        kind: "SPOTIFY",
        url: "https://spotify.com",
        expected: "/icons/Spotify.svg",
      },
      {
        kind: "APPLEMUSIC",
        url: "https://music.apple.com",
        expected: "/icons/AppleMusic.svg",
      },
      {
        kind: "TELEGRAM",
        url: "https://t.me",
        expected: "/icons/Telegram.svg",
      },
      {
        kind: "DISCORD",
        url: "https://discord.gg",
        expected: "/icons/Discord.svg",
      },
      {
        kind: "THREADS",
        url: "https://threads.net",
        expected: "/icons/Threads.svg",
      },
      {
        kind: "TWITCH",
        url: "https://twitch.tv",
        expected: "/icons/Twitch.svg",
      },
      {
        kind: "BEHANCE",
        url: "https://behance.net",
        expected: "/icons/Behance.svg",
      },
      {
        kind: "ARTSTATION",
        url: "https://artstation.com",
        expected: "/icons/Artstation.svg",
      },
      {
        kind: "DRIBBBLE",
        url: "https://dribbble.com",
        expected: "/icons/Dribbble.svg",
      },
      {
        kind: "MEDIUM",
        url: "https://medium.com",
        expected: "/icons/Medium.svg",
      },
      {
        kind: "PINTEREST",
        url: "https://pinterest.com",
        expected: "/icons/Pinterest.svg",
      },
      { kind: "VIMEO", url: "https://vimeo.com", expected: "/icons/Vimeo.svg" },
      {
        kind: "MAPS",
        url: "https://maps.google.com",
        expected: "/icons/Maps.svg",
      },
      {
        kind: "DRIVE",
        url: "https://drive.google.com",
        expected: "/icons/Drive.svg",
      },
      {
        kind: "AMAZON",
        url: "https://amazon.com",
        expected: "/icons/Amazon.svg",
      },
      {
        kind: "ALIEXPRESS",
        url: "https://aliexpress.com",
        expected: "/icons/AliExpress.svg",
      },
      {
        kind: "MERCADOLIVRE",
        url: "https://mercadolivre.com.br",
        expected: "/icons/MercadoLivre.svg",
      },
      {
        kind: "SHOPEE",
        url: "https://shopee.com.br",
        expected: "/icons/Shopee.svg",
      },
      {
        kind: "HOTMART",
        url: "https://hotmart.com",
        expected: "/icons/Hotmart.svg",
      },
      {
        kind: "KIWIFY",
        url: "https://kiwify.com.br",
        expected: "/icons/Kiwify.svg",
      },
      { kind: "EDUZZ", url: "https://eduzz.com", expected: "/icons/Eduzz.svg" },
      {
        kind: "GITHUB",
        url: "https://github.com",
        expected: "/icons/Github.svg",
      },
      {
        kind: "IFOOD",
        url: "https://ifood.com.br",
        expected: "/icons/iFood.svg",
      },
      {
        kind: "MAGUISTUDIO",
        url: "https://magui.studio",
        expected: "/icons/MAGUIstudio.svg",
      },
      {
        kind: "USUARIO",
        url: "https://example.com/user",
        expected: "/icons/Usuario.svg",
      },
      {
        kind: "EMAIL",
        url: "mailto:test@gmail.com",
        expected: "/icons/Gmail.svg",
      },
      {
        kind: "EMAIL",
        url: "mailto:test@outlook.com",
        expected: "/icons/Outlook.svg",
      },
      { kind: "LINK", url: "https://random.com", expected: "/icons/Link.svg" },
    ];

    test.each(iconTests)(
      "renders correct icon for %s (%s)",
      ({ kind, url, expected }) => {
        const profileWithIcon = {
          ...mockProfile,
          MaguiConnectLink: [
            {
              ...mockProfile.MaguiConnectLink[0],
              label: `Test ${kind}`,
              kind,
              url,
            },
          ],
        };
        render(<ProfileView profile={profileWithIcon} />);
        const img = screen.getByAltText(`Test ${kind}`);
        expect(img).toHaveAttribute("src", expected);
      }
    );
  });

  describe("Link Visibility", () => {
    test("hides links that haven't started yet", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            startsAt: futureDate.toISOString(),
            label: "Future Link",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      expect(screen.queryByText("Future Link")).not.toBeInTheDocument();
    });

    test("hides expired links", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            expiresAt: pastDate.toISOString(),
            label: "Past Link",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      expect(screen.queryByText("Past Link")).not.toBeInTheDocument();
    });
  });

  describe("Display variations (20+ tests)", () => {
    const variations = [
      { key: "displayName", value: "Custom Name", text: "Custom Name" },
      { key: "professionalCategory", value: "Designer", text: "Designer" },
      { key: "location", value: "Paris", text: "Paris" },
      { key: "companyName", value: "Design Studio", text: "Design Studio" },
      { key: "headline", value: "Custom Headline", text: "Custom Headline" },
      { key: "bio", value: "Custom Bio", text: "Custom Bio" },
      { key: "primaryCtaLabel", value: "Click Me", text: "Click Me" },
      { key: "secondaryCtaLabel", value: "Maybe Later", text: "Maybe Later" },
    ];

    test.each(variations)(
      "renders variation for %s",
      ({ key, value, text }) => {
        const profile = { ...mockProfile, [key]: value };
        render(<ProfileView profile={profile} />);
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );

    test("renders fallback char when avatar is missing", () => {
      const profile = { ...mockProfile, avatarUrl: null, displayName: "Alice" };
      render(<ProfileView profile={profile} />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    test("renders custom whatsapp message", () => {
      const profile = {
        ...mockProfile,
        whatsapp: "5511999999999",
        whatsappMessage: "Opa!",
      };
      render(<ProfileView profile={profile} />);
      const waLink = screen.getByTitle("WhatsApp");
      expect(waLink).toHaveAttribute("href", expect.stringContaining("Opa!"));
    });

    test("handles links without kind (inference)", () => {
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            kind: null,
            url: "https://instagram.com/test",
            label: "Inferred Insta",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      const img = screen.getByAltText("Inferred Insta");
      expect(img).toHaveAttribute("src", "/icons/Instagram.svg");
    });

    test("handles magui.studio links without kind (inference)", () => {
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            kind: null,
            url: "https://magui.studio/test",
            label: "Inferred Magui",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      const img = screen.getByAltText("Inferred Magui");
      expect(img).toHaveAttribute("src", "/icons/MAGUIstudio.svg");
    });

    test("renders featured link with white text style", () => {
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            isFeatured: true,
            label: "Featured",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      const link = screen.getByText("Featured").closest("a");
      expect(link).toHaveStyle({ backgroundColor: "#ff0000" });
    });

    test("renders countdown for expiring links", () => {
      const soon = new Date();
      soon.setHours(soon.getHours() + 2);
      const profile = {
        ...mockProfile,
        MaguiConnectLink: [
          {
            ...mockProfile.MaguiConnectLink[0],
            expiresAt: soon.toISOString(),
            label: "Expiring Soon",
          },
        ],
      };
      render(<ProfileView profile={profile} />);
      expect(screen.getByText(/Encerra em/)).toBeInTheDocument();
    });
  });
});
