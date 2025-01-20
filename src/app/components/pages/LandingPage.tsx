import { IconBase } from "react-icons/lib";
import { Button } from "../ui/Button";
import {motion} from 'framer-motion';
import { FaFileShield } from "react-icons/fa6";


const cards: CardElementProps[] = [
  {
    title: "Collaborative Investigation",
    description: "Unite your team to crack challenging mysteries with seamless collaboration and cutting-edge tools."
  },
  {
    title: "Real-time Updates",
    description: "Experience seamless collaboration with live updates that keep everyone aligned and informed."
  },
  {
    title: "Evidence Tracking",
    description: "Simplify your investigation with an intuitive space for managing all your evidence and discoveries."
  }
]


type CardElementProps = {
  title: string;
  description: string;
}

const CardElement = ({title, description}: CardElementProps) => {
  return (
    <motion.div className="flex flex-col p-12 md:p-4 gap-3 transition-colors  rounded-md ">
      <div className="flex gap-3 items-center">
      <div className="p-2 border-2 border-[#B4540A] text-2xl md:text-xl max-w-fit bg-[#FFF0DF] text-[#B4540A] rounded-md"><FaFileShield /></div>
      <h3 className="text-2xl md:text-xl font-bold text-[#2c2420]">{title}</h3>
      </div>
      <p className="text-[#2c2420]/80 text-lg mt-2">{description}</p>
    </motion.div>
  );
}

export const LandingPage = () => {
  return (
    <div className="w-full h-full max-w-[1440px] mx-auto p-4 md:pt-8">
    <section className=" min-h-[75vh] flex flex-row md:flex-col gap-6 md:gap-2 items-center justify-start">
      <div className="flex flex-col gap-6  w-2/3 md:w-full">
      <h1 className="relative">
        <motion.span
        initial={{opacity:0, x:20}}
        animate={{opacity:1, x:0}}
        transition={{delay:0.1, duration:0.5}}
         className="text-7xl md:text-5xl font-black leading-tighter bg-gradient-to-r  from-[#2c2420] to-[#594c45] bg-clip-text text-transparent">
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
        className="text-7xl md:text-5xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent animate-[fadeInUp_0.2s_ease-in_150ms_forwards] opacity-0">
          Detective Board
        </motion.span>
      </h1>

      <motion.p 
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.3, duration:0.5}}
      className="text-xl md:text-base max-w-2xl  text-[#333333]/90 leading-relaxed font-medium">
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
    <section className="  h-5/6 w-full mx-auto flex flex-col gap-6 items-center justify-center">
    <div className="  w-[75%] md:w-full h-full md:h-2/3 bg-[#FFF0DF] border-4 shadow-2xl border-[#B4540A] rounded-md"></div>
    </section>

    <section className=" mt-[200px] md:mt-[50px] h-full max-h-[500px] md:max-h-full w-full mx-auto flex flex-col gap-6 items-center justify-start">
    <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent">Overview</h3>
      <div className=" w-full md:w-full grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-6 mt-8 md:mt-2">{cards.map(( card, index ) => <CardElement key={index} title={card.title} description={card.description}/>)}</div>
    </section>

    </div>
  );
};
