import React from "react";
import Image from "next/image";

const Footer = () => {
  //:::* States :::*//
  const imageStyle = {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
  };
  return (
    <>
      {/* Modern Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-48 mb-12 max-w-4xl mx-auto">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src={"/images/jobs_logo_white.svg"}
                  width={250}
                  height={60}
                  style={imageStyle}
                  alt="logo"
                />
              </div>
              <p className="text-gray-400 mb-4">
                უბრალოდ კარგი ვაკანსიები და შესაძლებლობები ერთ სივრცეში.
              </p>
            </div>

            {/* <div>
              <h3 className="font-semibold text-lg mb-4">კანდიდატებისთვის</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    ვაკანსიების ძებნა
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    კომპანიების ნახვა
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ხელფასების კალკულატორი
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    კარიერის რჩევები
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    რეზიუმეს შაბლონები
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">დამსაქმებლებისთვის</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    ვაკანსიის განთავსება
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ტარიფები
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ტალანტების ძებნა
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    HR რესურსები
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ბრენდინგის გვერდი
                  </a>
                </li>
              </ul>
            </div> */}

            <div className="md:ms-auto">
              <h3 className="font-semibold text-lg mb-4">საკონტაქტო</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  m.chargeishvili@dk.ge
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  +995 568 951 554
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  ელიზბარ მინდელის 7ბ, Tbilisi, Georgia
                </li>
                <li className="mt-5">
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/KENCHADZE.Jobs"
                      target="_blank"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/kenchadze-jobs/posts/?feedView=all"
                      target="_blank"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://linktr.ee/davidkenchadze"
                      target="_blank"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                    >
                      <svg
                        width="36"
                        height="26"
                        viewBox="0 0 36 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_13011_173735)">
                          <path
                            d="M19.881 6.34096L24.2196 1.88105L26.7378 4.45991L22.1869 8.79846H28.5885V12.3785H22.1565L26.7378 16.8283L24.2196 19.3566L18 13.1067L11.7804 19.3566L9.26221 16.8384L13.8435 12.3886H7.4115V8.79846H13.8131L9.26221 4.45991L11.7804 1.88105L16.1189 6.34096V0H19.881V6.34096ZM16.1189 17.5059H19.881V26.001H16.1189V17.5059Z"
                            fill="white"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_13011_173735">
                            <rect width="36" height="26" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
