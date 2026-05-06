import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileView } from "./ProfileView";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    a: ({
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props}>{children}</a>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock phosphor icons
vi.mock("@phosphor-icons/react", () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  ArrowUpRight: () => <span data-testid="arrow-up-right" />,
  Envelope: () => <span data-testid="envelope" />,
  MapPin: () => <span data-testid="map-pin" />,
  Phone: () => <span data-testid="phone" />,
}));

// Mock ThemeToggle
vi.mock("./common/themeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

// Mock ScrollArea
vi.mock("../src/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

const mockProfile = {
  id: "1",
  displayName: "John Doe",
  heroKicker: "Hello",
  heroHeadline: "Welcome to my profile",
  heroDescription: "This is a hero description",
  headline: "Software Engineer",
  bio: "I build things for the web.",
  avatarUrl: "https://example.com/avatar.jpg",
  bannerUrl: "https://example.com/banner.jpg",
  professionalCategory: "Technology",
  location: "New York, NY",
  companyName: "Tech Corp",
  whatsapp: "5511999999999",
  whatsappMessage: "Hi John!",
  publicEmail: "john@example.com",
  publicPhone: "+1234567890",
  primaryCtaLabel: "Book a call",
  primaryCtaUrl: "https://calendly.com/johndoe",
  secondaryCtaLabel: "Portfolio",
  secondaryCtaUrl: "https://johndoe.com",
  themeAccent: "#ff0000",
  slug: "johndoe",
  MaguiConnectLink: [
    {
      id: "link1",
      label: "My Website",
      url: "https://johndoe.com",
      customShortDescription: "Personal website",
      kind: "LINK",
      startsAt: null,
      expiresAt: null,
      isFeatured: false,
      isActive: true,
      openInNewTab: true,
      sectionId: null,
    },
    {
      id: "link2",
      label: "Instagram",
      url: "https://instagram.com/johndoe",
      customShortDescription: "Follow me",
      kind: "INSTAGRAM",
      startsAt: null,
      expiresAt: null,
      isFeatured: true,
      isActive: true,
      openInNewTab: true,
      sectionId: null,
    },
  ],
  MaguiConnectSection: [
    {
      id: "section1",
      title: "Social Media",
      description: "Find me online",
      isCollapsible: false,
      isActive: true,
      MaguiConnectLink: [
        {
          id: "link3",
          label: "Twitter",
          url: "https://twitter.com/johndoe",
          customShortDescription: "Tweets",
          kind: "X",
          startsAt: null,
          expiresAt: null,
          isFeatured: false,
          isActive: true,
          openInNewTab: true,
          sectionId: "section1",
        },
      ],
    },
  ],
};

describe("ProfileView", () => {
  it("renders profile information correctly", () => {
    render(<ProfileView profile={mockProfile} />);

    expect(screen.getByText(mockProfile.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.headline)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.bio)).toBeInTheDocument();
    expect(
      screen.getByText(mockProfile.professionalCategory)
    ).toBeInTheDocument();
    expect(screen.getByText(mockProfile.location)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.companyName)).toBeInTheDocument();

    // Hero section
    expect(screen.getByText(mockProfile.heroKicker)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.heroHeadline)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.heroDescription)).toBeInTheDocument();
  });

  it("renders empty state when profile has no content", () => {
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
      screen.getByText(/Estamos preparando algo especial/i)
    ).toBeInTheDocument();
  });

  it("renders top-level links correctly", () => {
    render(<ProfileView profile={mockProfile} />);

    expect(screen.getByText("My Website")).toBeInTheDocument();
    expect(screen.getByText("Personal website")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
  });

  it("renders section links correctly", () => {
    render(<ProfileView profile={mockProfile} />);

    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("Find me online")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders quick actions correctly", () => {
    render(<ProfileView profile={mockProfile} />);

    const whatsappLink = screen.getByTitle("WhatsApp");
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5511999999999")
    );
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringContaining("text=Hi%20John!")
    );

    const emailLink = screen.getByTitle("Email");
    expect(emailLink).toHaveAttribute("href", "mailto:john@example.com");

    const phoneLink = screen.getByTitle("Phone");
    expect(phoneLink).toHaveAttribute("href", "tel:+1234567890");
  });

  it("renders primary and secondary CTAs", () => {
    render(<ProfileView profile={mockProfile} />);

    const primaryCTA = screen.getByText(mockProfile.primaryCtaLabel);
    expect(primaryCTA.closest("a")).toHaveAttribute(
      "href",
      mockProfile.primaryCtaUrl
    );

    const secondaryCTA = screen.getByText(mockProfile.secondaryCtaLabel);
    expect(secondaryCTA.closest("a")).toHaveAttribute(
      "href",
      mockProfile.secondaryCtaUrl
    );
  });

  it("does not render scheduled or expired links", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour in future
    const pastDate = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour in past

    const profileWithTimedLinks = {
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
      MaguiConnectLink: [
        {
          id: "scheduled",
          label: "Scheduled Link",
          url: "https://example.com/scheduled",
          customShortDescription: null,
          kind: "LINK",
          startsAt: futureDate.toISOString(),
          expiresAt: null,
          isFeatured: false,
          isActive: true,
          openInNewTab: true,
          sectionId: null,
        },
        {
          id: "expired",
          label: "Expired Link",
          url: "https://example.com/expired",
          customShortDescription: null,
          kind: "LINK",
          startsAt: null,
          expiresAt: pastDate.toISOString(),
          isFeatured: false,
          isActive: true,
          openInNewTab: true,
          sectionId: null,
        },
      ],
      MaguiConnectSection: [],
    };

    render(<ProfileView profile={profileWithTimedLinks} />);

    expect(screen.queryByText("Scheduled Link")).not.toBeInTheDocument();
    expect(screen.queryByText("Expired Link")).not.toBeInTheDocument();
    // Now it should show empty state because everything else is null
    expect(screen.getByText("Em Breve")).toBeInTheDocument();
  });

  it("renders specific platform icons correctly", () => {
    const profileWithManyIcons = {
      ...mockProfile,
      MaguiConnectLink: [
        {
          ...mockProfile.MaguiConnectLink[0],
          id: "l1",
          label: "Github Link",
          kind: "GITHUB",
          url: "https://github.com/test",
        },
        {
          ...mockProfile.MaguiConnectLink[0],
          id: "l2",
          label: "iFood Link",
          kind: "IFOOD",
          url: "https://ifood.com.br/test",
        },
        {
          ...mockProfile.MaguiConnectLink[0],
          id: "l3",
          label: "Gmail Link",
          kind: "EMAIL",
          url: "mailto:test@gmail.com",
        },
      ],
    };

    render(<ProfileView profile={profileWithManyIcons} />);

    expect(screen.getByAltText("Github Link")).toHaveAttribute(
      "src",
      "/icons/Github.svg"
    );
    expect(screen.getByAltText("iFood Link")).toHaveAttribute(
      "src",
      "/icons/iFood.svg"
    );
    expect(screen.getByAltText("Gmail Link")).toHaveAttribute(
      "src",
      "/icons/Gmail.svg"
    );
  });

  it("applies theme accent color correctly", () => {
    render(<ProfileView profile={mockProfile} />);

    const primaryCTA = screen
      .getByText(mockProfile.primaryCtaLabel)
      .closest("a");
    expect(primaryCTA).toHaveStyle({
      backgroundColor: mockProfile.themeAccent,
    });

    const featuredLink = screen.getByText("Instagram").closest("a");
    expect(featuredLink).toHaveStyle({
      backgroundColor: mockProfile.themeAccent,
    });
  });

  it("renders location and company only if present", () => {
    const minimalProfile = {
      ...mockProfile,
      location: null,
      companyName: null,
    };

    const { rerender } = render(<ProfileView profile={minimalProfile} />);
    expect(screen.queryByTestId("map-pin")).not.toBeInTheDocument();
    expect(screen.queryByText(mockProfile.companyName)).not.toBeInTheDocument();

    rerender(<ProfileView profile={{ ...mockProfile, location: "Mars" }} />);
    expect(screen.getByTestId("map-pin")).toBeInTheDocument();
    expect(screen.getByText("Mars")).toBeInTheDocument();
  });

  it("handles openInNewTab prop correctly", () => {
    const profileWithMixedLinks = {
      ...mockProfile,
      MaguiConnectLink: [
        { ...mockProfile.MaguiConnectLink[0], openInNewTab: true },
        { ...mockProfile.MaguiConnectLink[1], openInNewTab: false },
      ],
    };

    render(<ProfileView profile={profileWithMixedLinks} />);

    const link1 = screen.getByText("My Website").closest("a");
    expect(link1).toHaveAttribute("target", "_blank");

    const link2 = screen.getByText("Instagram").closest("a");
    expect(link2).toHaveAttribute("target", "_self");
  });

  it("renders phone quick action correctly", () => {
    const profileWithPhone = {
      ...mockProfile,
      publicEmail: null,
      whatsapp: null,
    };

    render(<ProfileView profile={profileWithPhone} />);
    expect(screen.getByTitle("Phone")).toBeInTheDocument();
    expect(screen.getByAltText("Phone")).toHaveAttribute(
      "src",
      "/icons/Link.svg"
    );
  });

  it("shows links that have started and not yet expired", () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 1000 * 60 * 60);
    const futureDate = new Date(now.getTime() + 1000 * 60 * 60);

    const profileWithTimedLinks = {
      ...mockProfile,
      MaguiConnectLink: [
        {
          ...mockProfile.MaguiConnectLink[0],
          id: "valid-timed",
          label: "Valid Timed Link",
          startsAt: pastDate.toISOString(),
          expiresAt: futureDate.toISOString(),
        },
      ],
    };

    render(<ProfileView profile={profileWithTimedLinks} />);
    expect(screen.getByText("Valid Timed Link")).toBeInTheDocument();
  });

  it("renders featured link with white text", () => {
    render(<ProfileView profile={mockProfile} />);
    const featuredLink = screen.getByText("Instagram").closest("a");
    expect(featuredLink).toHaveClass("text-white");
  });

  it("handles missing hero section fields gracefully", () => {
    const partialHeroProfile = {
      ...mockProfile,
      heroKicker: null,
      heroDescription: null,
    };
    render(<ProfileView profile={partialHeroProfile} />);
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.getByText(mockProfile.heroHeadline)).toBeInTheDocument();
  });

  it("renders section description if present", () => {
    render(<ProfileView profile={mockProfile} />);
    expect(screen.getByText("Find me online")).toBeInTheDocument();
  });

  it("renders placeholder banner if bannerUrl is missing", () => {
    const noBannerProfile = { ...mockProfile, bannerUrl: null };
    render(<ProfileView profile={noBannerProfile} />);
    const banner = screen.getByAltText("Banner");
    expect(banner).toHaveAttribute("src", "/images/placeholder.svg");
  });

  it("renders avatar placeholder if avatarUrl is missing", () => {
    const noAvatarProfile = { ...mockProfile, avatarUrl: null };
    render(<ProfileView profile={noAvatarProfile} />);
    expect(screen.getByText("J")).toBeInTheDocument(); // Initial of John Doe
  });
});
