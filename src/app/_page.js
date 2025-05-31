"use client";
import Image from "next/image";
import {Flex, Button, Card, Space, Avatar } from "antd";
import { motion } from "framer-motion";

export default function Home() {
  const text = "Sain uu!";
  const characters = Array.from(text); // 
  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}  
      animate={{ scale: 1, opacity: 1 }}   
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
    >
      <Card style={{ backgroundColor: 'var(--bg-custom-dark)' }} className="contact text-white border-none w-[380px] w-full rounded-1xl shadow-[0_4px_10px_rgba(25,25,31,0.75)] bg-dark-custom">
        <div className="my-4 block text-center">
          <div className="w-[150px] relative mx-auto  mt-10">
            <div className="bubble rounded absolute font-semibold text-xs text-black z-10">
              <motion.div
                style={{
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  position: 'relative',
              }}>
                {characters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: index * 0.3, // Adjust delay slightly to make each character appear more clearly
                      duration: 0.1,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>
            <Avatar
              shape="square"
              size={150} 
              src="/images/avatar.jpg" 
              alt="Manaltseren B"
              className="shadow-[0_0_0_7px_rgba(255,255,255,0.05)] rounded-full"
            />
          </div>
        </div>
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold">Manalaa B.</h1>
          <div className="text-sm text-white/65">Web Developer</div>
        </div>
        <div className="mx-5 mb-7">
          <Flex gap="small" wrap className="text-center items-center justify-center mb-5">
            <Button className="social-link rounded-md hover:bg-black" color="default" variant="solid" icon={<i className="la la-envelope"></i>} size="large" href="mailto:manaltseren@gmail.com" />
            <Button className="social-link rounded-md" color="default" variant="solid" icon={<i className="la la-mobile"></i>} size="large" href="tel:90911025" />
            <Button className="social-link rounded-md" color="default" variant="solid" icon={<i className="la la-linkedin"></i>} size="large" href="https://www.linkedin.com/in/manaltseren-b-5883b214b/" target="_blank" />
            <Button className="social-link rounded-md" color="default" variant="solid" icon={<i className="la la-facebook"></i>} size="large" href="https://fb.com/gyalb44" target="_blank" />
            <Button className="social-link rounded-md" color="default" variant="solid" icon={<i className="la la-instagram"></i>} size="large" href="https://www.instagram.com/manal.dev/" target="_blank" />
          </Flex>
          <div className="text-center items-center justify-center">
            <Button className="btn-add font-bold mt-4 py-6 rounded border-none" block href="/vcard.vcf" >
              {/* <i className="las la-plus-square text-xl"></i> */}
              Add to Contact
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
      
  );
}
