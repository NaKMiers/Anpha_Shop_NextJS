"use client";

import { ICategory } from "@/models/CategoryModel";
import { ITag } from "@/models/TagModel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaChevronDown, FaTag } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import BannerMenu from "./BannerMenu";
import Carousel from "./Carousel";
import Header from "./Header";
import Slider from "./Slider";
import { IProduct } from "@/models/ProductModel";

interface BannerProps {
  categories: ICategory[];
  tags: ITag[];
  carouselProducts: IProduct[];
}

function Banner({ carouselProducts = [], categories = [], tags = [] }: BannerProps) {
  // states
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);

  // set width
  useEffect(() => {
    // handle resize
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // initial width
    setWidth(window.innerWidth);

    // add event listener
    window.addEventListener("resize", handleResize);

    // remove event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className='h-screen py-21'>
      {/* Main Banner */}
      <div
        className='flex flex-col h-full w-full max-w-1200 mx-auto rounded-medium shadow-medium overflow-hidden bg-white bg-opacity-90'
        style={{ height: "calc(100vh - 2 * 21px)" }}
      >
        {/* MARK: Header in Banner */}
        <Header isStatic hideSearch />

        {/* Banner Content */}
        <div
          className='relative flex flex-col gap-21 p-21 overflow-hidden'
          style={{ height: "calc(100% - 72px)" }}
        >
          {/* MARK: Top */}
          <div className='flex flex-grow h-2/3 justify-between gap-21'>
            {/* Tag */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 pt-0 rounded-lg overflow-y-auto'>
              <h5 className='pt-2 sticky top-0 bg-white text-[20px] font-semibold text-center text-dark'>
                Tag
              </h5>

              {tags?.map((tag) => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={tag.title}
                >
                  <Link
                    href={`/tag?tag=${tag.slug}`}
                    prefetch={false}
                    className='flex items-center px-[10px] py-[6px]'
                  >
                    <FaTag size={16} className='wiggle' />
                    <span className='ms-2'>{tag.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Slider */}
            <Slider
              time={5000}
              mobile={width < 576 && width > 0}
              thumbs={
                width < 576 && width > 0
                  ? [
                      "/banners/office-365.jpg",
                      "/banners/netflix-random-mobile.jpg",
                      "/banners/grammarly-mobile.jpg",
                      "/banners/canva-mobile.jpg",
                      "/banners/spotify-mobile.jpg",
                    ]
                  : [
                      "/banners/office-365.jpg",
                      "/banners/netflix-random.jpg",
                      "/banners/grammarly.jpg",
                      "/banners/canva.jpg",
                      "/banners/spotify.jpg",
                    ]
              }
            >
              <Link href='/category?ctg=microsoft-office'>
                <Image
                  className='hover:scale-105 transition-all duration-700'
                  src={width < 576 && width > 0 ? "/banners/office-365.jpg" : "/banners/office-365.jpg"}
                  alt='netflix'
                  width={1200}
                  height={768}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Link href='/random-netflix-van-may-se-thay-ban-tra-tien'>
                <Image
                  className='hover:scale-105 transition-all duration-700'
                  src={
                    width < 576 && width > 0
                      ? "/banners/netflix-random-mobile.jpg"
                      : "/banners/netflix-random.jpg"
                  }
                  alt='netflix'
                  width={1200}
                  height={768}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Link href='/grammarly-premium-1-thang-danh-bai-loi-ngu-phap-voi-uu-dai-dac-biet'>
                <Image
                  className='hover:scale-105 transition-all duration-700'
                  src={
                    width < 576 && width > 0 ? "/banners/grammarly-mobile.jpg" : "/banners/grammarly.jpg"
                  }
                  alt='grammarly'
                  width={1200}
                  height={768}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Link href='/category?ctg=canva'>
                <Image
                  className='hover:scale-105 transition-all duration-700'
                  src={width < 576 && width > 0 ? "/banners/canva-mobile.jpg" : "/banners/canva.jpg"}
                  alt='canva'
                  width={1200}
                  height={768}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Link href='/category?ctg=spotify'>
                <Image
                  className='hover:scale-105 transition-all duration-700'
                  src={width < 576 && width > 0 ? "/banners/spotify-mobile.jpg" : "/banners/spotify.jpg"}
                  alt='spotify'
                  width={1200}
                  height={768}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </Slider>

            {/* Category */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg overflow-y-auto'>
              <h5 className='ml-2 text-[20px] font-semibold text-center text-dark'>Thể loại</h5>

              <li className='group rounded-extra-small text-dark hover:bg-primary common-transition'>
                <Link
                  href='/flashsale'
                  prefetch={false}
                  className='flex items-center px-[10px] py-[6px] gap-2'
                >
                  <FaBoltLightning size={16} className='wiggle text-secondary' />
                  <span className='font-bold text-secondary'>FLASHSALES</span>
                </Link>
              </li>

              {categories?.map((category) => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={category.title}
                >
                  <Link
                    href={`/category?ctg=${category.slug}`}
                    prefetch={false}
                    className='flex items-center px-[10px] py-[6px]'
                  >
                    <BiSolidCategoryAlt size={17} className='wiggle' />
                    <span className='ms-2'>{category.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MARK: Bottom */}
          <div className='relative shrink-0 -mb-4'>
            <Carousel products={carouselProducts} />
          </div>

          {/* MARK: Menu Section */}
          {/* Menu Button */}
          <button
            className={`lg:hidden absolute top-0 right-0 p-2 bg-white rounded-bl-lg group transition-all duration-300 delay-200 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => setIsMenuOpen(true)}
          >
            <div className='rotate-45'>
              <FaChevronDown size={18} className='wiggle' />
            </div>
          </button>

          {/* Menu */}
          <BannerMenu open={isMenuOpen} setOpen={setIsMenuOpen} categories={categories} tags={tags} />
        </div>
      </div>
    </section>
  );
}

export default Banner;
