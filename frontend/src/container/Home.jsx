import React, { useState, useEffect, useRef } from 'react'
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Login, Sidebar, UserProfile } from '../components'
import Pins from './Pins'
import { client } from '../client';
import logo from '../assets/logo.png';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';


const Home = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  // this is just user info now we will get user from sanity 
  useEffect(() => {
    const query = userQuery(userInfo?.googleId)
    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [])
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSideBar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full " />
          </Link>
        </div>
        {
          toggleSideBar && (
            <div className="fixed w-4/5 h-screen bg-white overflow-y-auto shadow-md z-10 animate-slide-in">
              <div className="absolute w-full flex justify-end items-center p-2">
                <AiFillCloseCircle fontSize={30} className="cursor-pointer " onClick={() => setToggleSideBar(false)} />
              </div>
              {/* if user exists than send it */}
              <Sidebar user={user && user} closeToggle={setToggleSideBar} />
            </div>
          )
        }

      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home