"use client";

import React, { useState, useEffect } from "react";

import "@fontsource/montserrat";

import { useRouter } from "next/navigation";

const Home = (params) => {
  return (
    <h1 className="text-3xl font-bold text-center">
      Página del usuario por id
    </h1>
  );
};

export default Home;
