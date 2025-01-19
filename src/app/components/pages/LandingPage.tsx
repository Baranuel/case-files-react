import { Button } from "../ui/Button";
import {motion} from 'framer-motion';

export const LandingPage = () => {
  return (
    <div className="w-full h-full max-w-[1440px] mx-auto p-2">
    <section className=" min-h-[75vh] flex flex-row md:flex-col gap-6 items-center justify-start">
      <div className="flex flex-col gap-6 w-2/3 md:w-full">
      <h1 className="relative">
        <motion.span
        initial={{opacity:0, x:20}}
        animate={{opacity:1, x:0}}
        transition={{delay:0.1, duration:0.5}}
         className="text-7xl md:text-6xl font-black leading-tighter bg-gradient-to-r  from-[#2c2420] to-[#594c45] bg-clip-text text-transparent">
          Your Digital
          <span className="relative inline-block">
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#2c2420]/20 rounded-full"></span>
          </span>
        </motion.span>
        <br />
        <motion.span
               initial={{opacity:0, x:20}}
               animate={{opacity:1, x:0}}
               transition={{delay:0.2, duration:0.5}} 
        className="text-7xl md:text-6xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent animate-[fadeInUp_0.2s_ease-in_150ms_forwards] opacity-0">
          Detective Board
        </motion.span>
      </h1>

      <motion.p 
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.3, duration:0.5}}
      className="text-xl max-w-2xl  text-[#333333]/90 leading-relaxed font-medium">
        Team up with friends, family, or teammates to help Sherlock Holmes solve
        mysteries on 221B Baker Street. Our interactive detective boards turn
        every case into a collaborative adventure!
      </motion.p>

      <Button variant='primary' className="max-w-[150px]  text-base shadow-md" title="Create Board Button">
        Create Board
      </Button>
      </div>
      
      <motion.img
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.4, duration:0.5}}
      src="casefile.png" alt="Sherlock Holmes" className="w-auto  max-h-[400px] mt-4 " />
    </section>
    <section className="mt-[25px] h-full md:h-1/2 w-[80%]  md:w-full mx-auto flex flex-col gap-6 justify-center bg-[#FFF0DF] border-4 shadow-2xl border-[#B4540A] rounded-md ">
    </section>
    
    <section className=" mt-[200px] h-full md:h-1/2 w-[85%]  md:w-full mx-auto flex flex-col gap-6 justify-center bg-[#FFF0DF] border-4 shadow-2xl border-[#B4540A] rounded-md ">
    </section>

    </div>
  );
};
