const NotFound = () => {
      return (
            <div className="w-full z-10 flex py-40 justify-center">
                  <div className="absolute  flex w-3/4  justify-center items-center overflow-hidden bg-white  shadow-lg max-w-96 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" height="96" width="16">
                              <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    stroke="indianred"
                                    fill="indianred"
                                    d="M 8 0 
               Q 4 4.8, 8 9.6 
               T 8 19.2 
               Q 4 24, 8 28.8 
               T 8 38.4 
               Q 4 43.2, 8 48 
               T 8 57.6 
               Q 4 62.4, 8 67.2 
               T 8 76.8 
               Q 4 81.6, 8 86.4 
               T 8 96 
               L 0 96 
               L 0 0 
               Z"
                              ></path>
                        </svg>
                        <div className="mx-2.5 overflow-hidden  w-full">
                              <p className="mt-1.5 text-xl font-bold text-[indianred] leading-8 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">Trailer Not Found</p>
                              <p className="leading-5 break-all text-zinc-400 max-h-10">
                                    Oh no!
                                    <br />I believe youtube is not allowing us to play trailer 😣
                              </p>
                        </div>
                  </div>
            </div>
      );
};

export default NotFound;
