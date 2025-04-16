"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RadioIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllStreams } from "@/app/lib/actions";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";

// Main category tabs at the top
const MainCategoryTabs = ({
  activeMainCategory,
  setActiveMainCategory,
  mainCategories = [],
}: any) => {
  // Default categories to show if no data from Firebase
  const defaultCategories = [
    {
      id: "game",
      label: "Game",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      id: "sports",
      label: "Sports",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  // Use categories from Firebase if available, otherwise use defaults
  const categories =
    mainCategories.length > 0
      ? defaultCategories.filter((cat) =>
          //@ts-ignore

          mainCategories.some((m) => m.toLowerCase() === cat.id.toLowerCase())
        )
      : defaultCategories;

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 py-4 sm:py-6 px-2">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`
            flex items-center px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base text-white font-medium transition-all duration-300
            ${
              activeMainCategory === category.id
                ? "bg-green-500 text-white"
                : "bg-transparent border border-green-500 text-green-500 hover:bg-green-500/10"
            }
          `}
          onClick={() => setActiveMainCategory(category.id)}
        >
          {category.icon}
          {category.label}
          <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      ))}
    </div>
  );
};

// Sub-category pills with auto-scrolling
const CategoryPills = ({
  activeCategory,
  categories,
  setActiveCategory,
}: any) => {
  const scrollContainerRef = useRef(null);
  const [autoScrollActive, setAutoScrollActive] = useState(true);
  const [scrollDirection, setScrollDirection] = useState("right");
  const [isHovering, setIsHovering] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Helper function to get icon based on category name
  const getCategoryIcon = (category: any) => {
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes("esports") || categoryLower.includes("gaming")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      );
    }

    if (
      categoryLower.includes("football") ||
      categoryLower.includes("soccer")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.57 9.13a.57.57 0 01-.15-.77l3-4a.57.57 0 01.92 0l3 4a.57.57 0 01-.15.77l-3 2a.57.57 0 01-.62 0l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (categoryLower.includes("basketball")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8.293a1 1 0 011.414 0L10 11.379l3.086-3.086a1 1 0 111.414 1.414l-4.5 4.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (categoryLower.includes("racing")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (categoryLower.includes("tennis")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (categoryLower.includes("tournament")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
      );
    }

    if (categoryLower.includes("live") || categoryLower.includes("streaming")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (categoryLower.includes("entertainment")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      );
    }

    // Default icon for any other category
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    );
  };

  // Check if scrolling arrows should be visible
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Show left arrow if scrolled to right
    //@ts-ignore

    setShowLeftArrow(container.scrollLeft > 10);

    // Show right arrow if there's content to scroll to
    setShowRightArrow(
      //@ts-ignore

      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Manual scroll function for arrow buttons
  //@ts-ignore

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Smaller scroll amount on mobile
      const baseScrollAmount = window.innerWidth < 640 ? 120 : 200;
      const scrollAmount =
        direction === "left" ? -baseScrollAmount : baseScrollAmount;
      //@ts-ignore

      current.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // Pause auto-scroll for a moment when manually scrolling
      setAutoScrollActive(false);
      setTimeout(() => {
        setAutoScrollActive(true);
        checkScrollPosition();
      }, 5000);
    }
  };

  // Auto-scrolling logic
  useEffect(() => {
    if (!autoScrollActive || isHovering) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const autoScrollInterval = setInterval(() => {
      // Check if we need to change direction
      if (
        scrollDirection === "right" &&
        //@ts-ignore

        container.scrollLeft >=
          //@ts-ignore

          container.scrollWidth - container.clientWidth - 10
      ) {
        setScrollDirection("left");
        checkScrollPosition();
        //@ts-ignore
      } else if (scrollDirection === "left" && container.scrollLeft <= 10) {
        setScrollDirection("right");
        checkScrollPosition();
      }

      // Perform the scroll
      const scrollAmount = scrollDirection === "left" ? -2 : 2;
      //@ts-ignore

      container.scrollLeft += scrollAmount;
    }, 30);

    return () => clearInterval(autoScrollInterval);
  }, [autoScrollActive, scrollDirection, isHovering]);

  // Add scroll event listener to update arrow visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    //@ts-ignore

    container.addEventListener("scroll", checkScrollPosition);
    // Initial check
    checkScrollPosition();

    return () => {
      //@ts-ignore

      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative max-w-full sm:max-w-screen-xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      <div className="flex items-center">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-black border border-green-500/30 text-white hover:bg-green-500/20 z-10 mr-1 sm:mr-3 flex-shrink-0"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} className="sm:size-18" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto scroll-smooth gap-2 sm:gap-3 py-1 sm:py-2 mx-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={() => setIsHovering(true)}
          onTouchEnd={() => {
            setIsHovering(false);
            setTimeout(() => checkScrollPosition(), 100);
          }}
        >
          {categories.map((category: any) => (
            <button
              key={category}
              className={`whitespace-nowrap px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center
            transition-all ${
              activeCategory === category
                ? "bg-green-500 text-white"
                : "bg-transparent border border-green-500/40 text-white hover:border-green-500"
            }`}
              onClick={() => {
                setActiveCategory(category);
                setAutoScrollActive(false);
                setTimeout(() => {
                  setAutoScrollActive(true);
                  checkScrollPosition();
                }, 5000);
              }}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-black border border-green-500/30 text-white hover:bg-green-500/20 z-10 ml-1 sm:ml-3 flex-shrink-0"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} className="sm:size-18" />
          </button>
        )}
      </div>
    </div>
  );
};

// StreamCard component for displaying individual streams
const StreamCard = ({ stream }: any) => {
  const {
    info: { uid, contactDetails, email, name },
    setinfo,
  } = useOwnersStore();
  console.log("In the catefory list", stream);
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log("User");
          const res = await getDoc(doc(db, "users", user.uid));
          setinfo({
            email: user.email!,
            name: res.data()!.name,
            uid: user.uid,
            contactDetails: res.data()!.contactDetails,
            vehicles: res.data()!.vehicles || [],
          });
        }
      } catch (e) {}
    });
  }, []);
  console.log("stream", stream);
  return (
    <Link
      href={`/watch/${stream.playbackId}`}
      className="block  rounded-lg overflow-hidden transition duration-300   hover:border-green-500/50 hover:shadow-lg group"
      style={{ backgroundColor: "#0F0F0F" }}
      onClick={async () => {
        if (uid) {
          await setDoc(
            doc(db, "UserHistory", uid),
            {
              streams: arrayUnion({ stream, watchedAt: Date.now() }),
            },
            { merge: true }
          );
        }
      }}
    >
      <div className="aspect-video relative">
        <div className="absolute inset-0  flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={stream.thumbnail || "/placeholders/stream-thumbnail.jpg"}
              alt={stream.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover z-0 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                //@ts-ignore
                e.target.src = "/placeholders/stream-thumbnail.jpg";
              }}
            />
          </div>

          {/* Live indicator */}
          {stream.isActive && (
            <div
              className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full flex items-center z-10"
              style={{ backgroundColor: "#46C190", color: "black" }}
            >
              <RadioIcon className="w-3 h-3 mr-1 animate-pulse" />
              LIVE
            </div>
          )}

          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-green-500 rounded-full p-3 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-white truncate">{stream.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm " style={{ color: "#46C190" }}>
            {stream.category}
          </p>
          {stream.totalViews !== undefined && (
            <p className="text-xs text-gray-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {stream.totalViews} views
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Full component that combines both category UI elements and shows streams
const GameCategories = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allStreams, setAllStreams] = useState({});
  const [loading, setLoading] = useState(true);
  const [filteredStreams, setFilteredStreams] = useState([]);

  // Fetch categories and streams from Firebase
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const streams = await getAllStreams();
        setAllStreams(streams);

        // Extract unique categories
        const allCategories = Object.keys(streams);
        //@ts-ignore

        setCategories(allCategories);

        // Set initial active category
        if (allCategories.length > 0) {
          const initialCategory = allCategories[0];
          //@ts-ignore

          setActiveCategory(initialCategory);
          //@ts-ignore

          setFilteredStreams(streams[initialCategory] || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching streams:", error);
        setLoading(false);
      }
    };

    fetchStreams();
  }, []); // Empty dependency array for initial mount only

  // Update filtered streams when activeCategory changes
  useEffect(() => {
    if (activeCategory && allStreams[activeCategory]) {
      setFilteredStreams(allStreams[activeCategory]);
    }
  }, [activeCategory, allStreams]);

  return (
    <div className="w-full  text-white">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-2 text-green-500">Loading categories...</p>
        </div>
      ) : (
        <>
          <CategoryPills
            activeCategory={activeCategory}
            categories={categories}
            setActiveCategory={setActiveCategory}
          />

          {/* Stream display section */}
          <div className="max-w-screen-xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              Trending {activeCategory} Streams
            </h2>

            {filteredStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStreams.map((stream) => (
                  //@ts-ignore

                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <div className=" rounded-lg p-8 text-center border border-green-500/20">
                <p className="text-gray-400">
                  No Live streams currently available in this category.
                </p>
                {/* <button className="mt-4 px-4 py-2 bg-green-500 text-black rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Start Streaming
                </button> */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GameCategories;
