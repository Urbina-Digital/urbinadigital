import React, { useRef, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import useMainStore from '../store/store';

import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/layout';
import styles from '../styles/Home.module.scss';
import urbinaProfile from '../public/IMG-8813.jpg';

export default function Home() {
  const { templateData, historySelectData, selectedHistory, updateSelectedHistory } = useMainStore(
    (state) => ({
      templateData: state.templateData,
      historySelectData: state.historySelectData,
      selectedHistory: state.selectedHistory,
      updateSelectedHistory: state.updateSelectedHistory,
    }));

  console.log('Home init - what is templateData', templateData);
  console.log('Home init - what is historySelectData', historySelectData);

  const handleHistoryChange = (event) => {
    console.log('is historySelectData working:', historySelectData);
    console.log('selectedHistory current:', selectedHistory);
    console.log('changing to:', event.target.value);

    for (let w = 0; w <= historySelectData.length - 1; w++) {
      if (historySelectData[w].name === event.target.value) {
        console.log('history item match found');
        updateSelectedHistory(historySelectData[w]);
      }
    }
    console.log('selectedHistory should be something:', selectedHistory);
  }
  
  return (
    <Layout>
      <section data-theme="luxury" className={`2xl:container md:mx-auto h-screen ` + styles.home_wrap}>
        <Head>
          <title>UrbiDigi</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <div className={`h-3/5 bg-primary-content w-full ` + styles.heading}>
          <motion.h1 className='title text-6xl'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}>
            Greetings.
          </motion.h1>
        </div> */}

        <motion.div
          className={`hero h-5/6 ` + styles.heading} 
          style={{backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)'}}>
          <div className="hero-overlay bg-opacity-60"></div>
          <div className={`hero-content h-full text-center text-neutral-content `+ styles.headingContent}>
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Greetings</h1>
              <p className="mb-5">
                Jogus Rogsum, my friends, Lorem Ipsum is demithos tryptasum. Imagine living in a world where everything you do is by choice, not because you have to. Rogan Ipsum, carpe diem! You ever look up at the stars and think, 'Man, there's so much we don't know about.' Veni, vidi, Rogan! We're just on this rock, spinning through space.
              </p>
            </div>
          </div>
        </motion.div>

        <div className={`bg-primary-content w-full h-3/5 ` + styles.intro}>
          <div className={styles.intro__hero}>
            <Image width={333} src={urbinaProfile} alt='Picture of Jason Urbina' />
          </div>
          <div className={styles.intro__content}>
            <h2 className={`text-3xl text-white `}>Jason Urbina</h2>
            <span className={`text-white `}>
              I'm Jason Urbina, a seasoned Front-End Web Developer based in Los Angeles, known for crafting exceptional digital experiences. My work is marked by unwavering precision, a keen eye for design aesthetics, and a deep understanding of the software development lifecycle. My passion lies in elevating the user experience, consistently delivering interfaces that resonate with consumers. My approach is anchored in robust technical architecture, ensuring seamless navigation while presenting users with clean, logically structured designs. I take pride in my role as an essential component of successful engineering projects, where my dedication to crafting user-centric solutions shines through.
            </span>
          </ div>
        </div>

        <div className={`bg-secondary w-full h-3/5 ` + styles.histories}>
          <div className={styles.histories__hero}>
            <select value={selectedHistory.name} defaultValue={'default'} className="select select-ghost w-full max-w-xs" onChange={handleHistoryChange}>
              <option disabled value='default'>See my previous work:</option>
              {historySelectData.map(item => 
                <option key={historySelectData.indexOf(item)} value={item.name}>
                  {item.name}
                </option>
                )}
            </select>
          </div>

          <div className={`divider `+ styles.histories__hero__divider}></div>

          {Object.keys(selectedHistory).length > 0 &&
            <div className={styles.histories__content}>
              <div className={`h-96 carousel carousel-vertical rounded-box ` + styles.histories__images}>
                {selectedHistory.imageList.map(url => 
                  <div key={selectedHistory.imageList.indexOf(url)} className="carousel-item h-full w-300">
                    <img src={url} />
                  </div>)}
              </div>

              <div className={styles.histories__data}>
                <h3 className='text-3xl mb-2'>{ selectedHistory.company }</h3>
                <h4 className='text-xl mb-3'>{ selectedHistory.position }</h4>
                <div className={styles.histories__bullets}>
                  {selectedHistory.points.map(point => 
                    <span key={selectedHistory.points.indexOf(point)} className='text-lg mb-1'> - { point.value }</span>
                  )}
                </div>

              </div>
            </div>
            }
            {Object.keys(selectedHistory).length === 0 &&
              <span>Nothing is selected!</span>
            }
        </div> 
        
        <footer className={`footer p-10 bg-neutral text-neutral-content ` + styles.footer}>
          <aside>
            <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg>
            <p>Urbina Digital LLC. <br/>Merging art and code since 2012</p>
          </aside> 
          <nav>
            <header className="footer-title">Socials</header> 
            <div className="grid grid-flow-col gap-4">
              <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a> 
              <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a> 
              <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
            </div>
          </nav>
        </footer>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </section>
    </Layout>
  )
}
