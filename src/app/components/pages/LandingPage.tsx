import { Button } from "../ui/Button";
import {motion} from 'framer-motion';
import { SlSizeFullscreen } from "react-icons/sl";
import { useNavigate } from "@tanstack/react-router";
import { MdOutlineMoreTime } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { FaRegImage, FaSearch } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import posthog from "posthog-js";



const cards: CardElementProps[] = [
  {
    icon: <div className="p-2 bg-[#E6F2ED] border-2 border-[#2C6E49]/30 rounded-md text-2xl md:text-xl">
            <GrGroup className="text-[#2C6E49]" />
          </div>,
    title: "Collaborative Investigation",
    description: "Unite your team to crack challenging mysteries with seamless collaboration and cutting-edge tools."
  },
  {
    icon: <div className="p-2 bg-[#FCEAEA] border-2 border-[#9B2226]/30 rounded-md text-2xl md:text-xl">
            <MdOutlineMoreTime className="text-[#9B2226]" />
          </div>,
    title: "Real-time Updates", 
    description: "Experience seamless collaboration with live updates that keep everyone aligned and informed."
  },
  {
    icon: <div className="p-2 bg-[#EBF3F8] border-2 border-[#457B9D]/30 rounded-md text-2xl md:text-xl">
            <SlSizeFullscreen className="text-[#457B9D]" />
          </div>,
    title: "Unlimited Space",
    description: "Boards can scale to any size you need for your investigation, making them able to support even the most complicated cases."
  },
  {
    icon: <div className="p-2 bg-[#F4F0EC] border-2 border-[#7F5539]/30 rounded-md text-2xl md:text-xl">
            <CgNotes className="text-[#7F5539]" />
          </div>,
    title: "Markdown Notes",
    description: "Our notes support Markdown, allowing you to format and style your text exactly how you like, from bold headings to bullet points."
  },
  {
    icon: <div className="p-2 bg-[#F5E6EF] border-2 border-[#5F0F40]/30 rounded-md text-2xl md:text-xl">
            <FaRegImage className="text-[#5F0F40]" />
          </div>,
    title: "Custom Portraits",
    description: "We Provide a wide selection of images to associate with a person. Making your case truly unique to what suspects you're dealing with."
  },
  {
    icon: <div className="p-2 bg-[#E8F3E8] border-2 border-[#386641]/30 rounded-md text-2xl md:text-xl">
            <FaSearch className="text-[#386641]" />
          </div>,
    title: "Searchable Evidence",
    description: "Search through your detective board with our intuitive lookup system. With our search system you can search for any element in your board."
  }
]


type CardElementProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CardElement = ({icon, title, description}: CardElementProps) => {
  return (
    <div className="flex max-h-[200px] flex-col p-8 md:p-4 gap-3 rounded-md">
      <div className="flex gap-3 items-center">
        {icon}
        <h3 className="text-2xl md:text-xl font-bold text-[#2c2420]">{title}</h3>
      </div>
      <p className="text-[#2c2420]/80 text-lg">{description}</p>
    </div>
  );
}

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full max-w-[1440px] mx-auto p-4 md:pt-8">
    <section className=" min-h-[75vh] md:min-h-[500px] max-h-fit-content flex flex-row md:flex-col md:items-start gap-6 md:gap-2 items-center justify-start">
      <div className="flex flex-col gap-6  w-2/3 md:w-full">
      <h1 className="">
        <motion.span
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.2, duration:0.5}}
         className="text-7xl lg:text-6xl md:text-5xl font-black leading-tighter bg-gradient-to-r  from-[#2c2420] to-[#594c45] bg-clip-text text-transparent">
          Your Digital
          <span className="relative inline-block">
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#2c2420]/20 rounded-full"></span>
          </span>
        </motion.span>
        <br />
        <motion.span
          onClick={() => posthog.capture('click_detective_board')}
               initial={{opacity:0}}
               animate={{opacity:1}}
               transition={{delay:0.4, duration:0.5}} 
        className="text-7xl lg:text-6xl md:text-5xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent animate-[fadeInUp_0.2s_ease-in_150ms_forwards] opacity-0">
          Detective Board
        </motion.span>
      </h1>

      <motion.p 
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.7, duration:0.5}}
      className="text-xl lg:text-base max-w-xl lg:max-w-xl text-[#333333]/90 leading-relaxed font-medium">
        Team up with friends, family, or teammates to help Sherlock Holmes solve
        mysteries on 221B Baker Street. Our interactive detective boards turn
        every case into a collaborative adventure!
      </motion.p>

      <motion.div
      initial={{opacity:0, x:-20}}
      animate={{opacity:1, x:0}}
      transition={{delay:0.7, duration:0.5}}
      className="flex">
      <Button onClick={() => navigate({ to: `/lobby` })} variant='primary' className="max-w-[150px]  text-base shadow-md" title="Create Board Button">
        Create Board
      </Button>
      </motion.div>
      </div>
      
      <motion.img
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.7, duration:0.5}}
      src="casefile.png" alt="Sherlock Holmes" className="w-auto  max-h-[400px] xl:max-h-[350px] lg:max-h-[275px] mt-4 shadow-xl " />
    </section>

    <motion.section 
    initial={{opacity:0, y:20}}
    animate={{opacity:1, y:0}}
    transition={{delay:0.7, duration:0.5}}
    className=" md:mt-[50px] h-full lg:h-3/4 md:h-1/2 w-full flex flex-col gap-12 md:gap-6 items-center justify-center ">
    <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent">Introduction</h3>
    <div className=" h-[600px] xl:h-[600px] lg:h-[500px] md:h-[275px] w-[70%] md:w-full  bg-[#FFF0DF] border-4 shadow-2xl border-[#B4540A] rounded-md"/>
    </motion.section>

    <section className=" mt-[150px] lg:mt-[100px] md:mt-[50px] h-full max-h-fit-content md:max-h-full w-full mx-auto flex flex-col gap-12 md:gap-6 items-center justify-start">
    <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent">Overview</h3>
      <div className=" w-full md:w-full grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-2 ">{cards.map(( card, index ) => <CardElement icon={card.icon} key={index} title={card.title} description={card.description}/>)}</div>
    </section>

    <section className=" my-[150px] lg:mt-[100px] md:mt-[50px] h-full max-h-[500px] md:max-h-full w-full mx-auto flex flex-col gap-12 md:gap-6 items-center justify-start">
    <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r  from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent">Free Access</h3>
    <p className="text-xl text-center  text-[#333333]/90 leading-relaxed font-medium">You can start using Casefiles for free, create up to 2 boards without any limits.</p>
    <Button onClick={() => navigate({ to: `/lobby` })} variant='primary' className="max-w-[150px]  text-base shadow-md" title="Create Board Button">
        Create Board
      </Button>
    </section>

    </div>
  );
};
