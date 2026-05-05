"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BattlePlayer = {
  id: string;
  name: string;
  team: string;
  role: string;
  image?: string;
};

type BattleTeam = {
  id: string;
  name: string;
  city: string;
  image?: string;
};

interface CreateBattleProps {
  players?: BattlePlayer[];
  teams?: BattleTeam[];
}

type ApiPlayerItem = {
  playerProfilesId?: string;
  id?: string;
  playerName?: string;
  profile?: { name?: string; team?: string; role?: string };
  player?: { name?: string };
  name?: string;
  title?: string;
  team?: string;
  logo?: string;
  role?: string;
};

type ApiTeamItem = {
  id?: string;
  teamName?: string;
  name?: string;
  city?: string;
  location?: string;
};

const fallbackPlayers: BattlePlayer[] = [
  // Mumbai Indians
  { id: "p1", name: "Rohit Sharma", team: "MI", role: "Batter" },
  { id: "p2", name: "Suryakumar Yadav", team: "MI", role: "Batter" },
  { id: "p3", name: "Jasprit Bumrah", team: "MI", role: "Bowler" },
  { id: "p4", name: "Hardik Pandya", team: "MI", role: "All-rounder" },
  { id: "p5", name: "Ishan Kishan", team: "MI", role: "Wicketkeeper" },
  { id: "p6", name: "Tim David", team: "MI", role: "Batter" },
  { id: "p7", name: "Dewald Brevis", team: "MI", role: "Batter" },
  { id: "p8", name: "Pat Cummins", team: "MI", role: "All-rounder" },
  { id: "p9", name: "Murugan Ashwin", team: "MI", role: "Bowler" },
  { id: "p10", name: "Nuwan Thushara", team: "MI", role: "Bowler" },
  { id: "p11", name: "Anmolpreet Singh", team: "MI", role: "Batter" },
  { id: "p12", name: "Dhawal Kulkarni", team: "MI", role: "Bowler" },
  { id: "p13", name: "Jason Behrendorff", team: "MI", role: "Bowler" },
  { id: "p14", name: "Gerald Coetzee", team: "MI", role: "Bowler" },
  { id: "p15", name: "Dilshan Madushanka", team: "MI", role: "Bowler" },
  
  // Chennai Super Kings
  { id: "p16", name: "MS Dhoni", team: "CSK", role: "Wicketkeeper" },
  { id: "p17", name: "Ravindra Jadeja", team: "CSK", role: "All-rounder" },
  { id: "p18", name: "Ruturaj Gaikwad", team: "CSK", role: "Batter" },
  { id: "p19", name: "Devon Conway", team: "CSK", role: "Batter" },
  { id: "p20", name: "Ambati Rayudu", team: "CSK", role: "Batter" },
  { id: "p21", name: "Shivam Dube", team: "CSK", role: "All-rounder" },
  { id: "p22", name: "Mukesh Choudhary", team: "CSK", role: "Bowler" },
  { id: "p23", name: "Tushar Jitesh Deshpande", team: "CSK", role: "All-rounder" },
  { id: "p24", name: "Prashant Solanki", team: "CSK", role: "Bowler" },
  { id: "p25", name: "Mitchell Santner", team: "CSK", role: "All-rounder" },
  { id: "p26", name: "Sam Curran", team: "CSK", role: "All-rounder" },
  { id: "p27", name: "Subhranshu Senapati", team: "CSK", role: "Batter" },
  { id: "p28", name: "Simarjeet Singh", team: "CSK", role: "Bowler" },
  { id: "p29", name: "Daryl Mitchell", team: "CSK", role: "Batter" },
  { id: "p30", name: "Matheesha Pathirana", team: "CSK", role: "Bowler" },
  
  // Royal Challengers Bangalore
  { id: "p31", name: "Virat Kohli", team: "RCB", role: "Batter" },
  { id: "p32", name: "Faf du Plessis", team: "RCB", role: "Batter" },
  { id: "p33", name: "Glenn Maxwell", team: "RCB", role: "All-rounder" },
  { id: "p34", name: "Rajat Patidar", team: "RCB", role: "Batter" },
  { id: "p35", name: "Dinesh Karthik", team: "RCB", role: "Wicketkeeper" },
  { id: "p36", name: "Shahbaz Ahmed", team: "RCB", role: "All-rounder" },
  { id: "p37", name: "Will Jacks", team: "RCB", role: "Batter" },
  { id: "p38", name: "Anuj Rawat", team: "RCB", role: "Wicketkeeper" },
  { id: "p39", name: "Mohammed Siraj", team: "RCB", role: "Bowler" },
  { id: "p40", name: "Josh Hazlewood", team: "RCB", role: "Bowler" },
  { id: "p41", name: "Yash Dayal", team: "RCB", role: "Bowler" },
  { id: "p42", name: "Reece Topley", team: "RCB", role: "Bowler" },
  { id: "p43", name: "Naveen ul Haq", team: "RCB", role: "Bowler" },
  { id: "p44", name: "Karn Sharma", team: "RCB", role: "Bowler" },
  { id: "p45", name: "Manoj Bhandage", team: "RCB", role: "Batter" },
  
  // Kolkata Knight Riders
  { id: "p46", name: "Shreyas Iyer", team: "KKR", role: "Batter" },
  { id: "p47", name: "Rinku Singh", team: "KKR", role: "Batter" },
  { id: "p48", name: "Nitish Rana", team: "KKR", role: "Batter" },
  { id: "p49", name: "Sunil Narine", team: "KKR", role: "All-rounder" },
  { id: "p50", name: "André Russell", team: "KKR", role: "All-rounder" },
  { id: "p51", name: "Pat Cummins", team: "KKR", role: "All-rounder" },
  { id: "p52", name: "Mitchell Starc", team: "KKR", role: "Bowler" },
  { id: "p53", name: "Harshit Rana", team: "KKR", role: "Bowler" },
  { id: "p54", name: "Varun Chakaravarthy", team: "KKR", role: "Bowler" },
  { id: "p55", name: "Ramandeep Singh", team: "KKR", role: "Bowler" },
  { id: "p56", name: "Anukul Roy", team: "KKR", role: "Bowler" },
  { id: "p57", name: "Suyash Sharma", team: "KKR", role: "Bowler" },
  { id: "p58", name: "Manish Pandey", team: "KKR", role: "Batter" },
  { id: "p59", name: "Phil Salt", team: "KKR", role: "Batter" },
  { id: "p60", name: "Shaun Marsh", team: "KKR", role: "Batter" },
  
  // Delhi Capitals
  { id: "p61", name: "David Warner", team: "DC", role: "Batter" },
  { id: "p62", name: "Rishabh Pant", team: "DC", role: "Wicketkeeper" },
  { id: "p63", name: "Sarfaraz Khan", team: "DC", role: "Batter" },
  { id: "p64", name: "Mandeep Singh", team: "DC", role: "Batter" },
  { id: "p65", name: "Prithvi Shaw", team: "DC", role: "Batter" },
  { id: "p66", name: "Axar Patel", team: "DC", role: "All-rounder" },
  { id: "p67", name: "Ashwin", team: "DC", role: "Bowler" },
  { id: "p68", name: "Khaleel Ahmed", team: "DC", role: "Bowler" },
  { id: "p69", name: "Mustafizur Rahman", team: "DC", role: "Bowler" },
  { id: "p70", name: "Chetan Sakariya", team: "DC", role: "Bowler" },
  { id: "p71", name: "Anrich Nortje", team: "DC", role: "Bowler" },
  { id: "p72", name: "Vicky Ostwal", team: "DC", role: "Bowler" },
  { id: "p73", name: "Mitchell Marsh", team: "DC", role: "All-rounder" },
  { id: "p74", name: "Lalit Yadav", team: "DC", role: "All-rounder" },
  { id: "p75", name: "Ripal Patel", team: "DC", role: "Batter" },
  
  // Lucknow Super Giants
  { id: "p76", name: "KL Rahul", team: "LSG", role: "Wicketkeeper" },
  { id: "p77", name: "Nicholas Pooran", team: "LSG", role: "Batter" },
  { id: "p78", name: "Ravi Bishnoi", team: "LSG", role: "Bowler" },
  { id: "p79", name: "Yudhvir Singh", team: "LSG", role: "Bowler" },
  { id: "p80", name: "Naveen ul Haq", team: "LSG", role: "Bowler" },
  { id: "p81", name: "Matt Henry", team: "LSG", role: "Bowler" },
  { id: "p82", name: "Avesh Khan", team: "LSG", role: "Bowler" },
  { id: "p83", name: "Mayank Yadav", team: "LSG", role: "Bowler" },
  { id: "p84", name: "Arjun Tendulkar", team: "LSG", role: "Bowler" },
  { id: "p85", name: "Justin Langer", team: "LSG", role: "All-rounder" },
  { id: "p86", name: "Deepak Hooda", team: "LSG", role: "All-rounder" },
  { id: "p87", name: "Krunal Pandya", team: "LSG", role: "All-rounder" },
  { id: "p88", name: "Marcus Stoinis", team: "LSG", role: "All-rounder" },
  { id: "p89", name: "Quinton de Kock", team: "LSG", role: "Wicketkeeper" },
  { id: "p90", name: "Devdutt Padikkal", team: "LSG", role: "Batter" },
  
  // Rajasthan Royals
  { id: "p91", name: "Sanju Samson", team: "RR", role: "Wicketkeeper" },
  { id: "p92", name: "Yashasvi Jaiswal", team: "RR", role: "Batter" },
  { id: "p93", name: "Riyan Parag", team: "RR", role: "All-rounder" },
  { id: "p94", name: "Devendra Bishoo", team: "RR", role: "Bowler" },
  { id: "p95", name: "Trent Boult", team: "RR", role: "Bowler" },
  { id: "p96", name: "Sandeep Sharma", team: "RR", role: "Bowler" },
  { id: "p97", name: "Navdeep Saini", team: "RR", role: "Bowler" },
  { id: "p98", name: "Manoj Bhandage", team: "RR", role: "Batter" },
  { id: "p99", name: "James Neesham", team: "RR", role: "All-rounder" },
  { id: "p100", name: "Dhruv Jurel", team: "RR", role: "Batter" },
  { id: "p101", name: "Karun Nair", team: "RR", role: "Batter" },
  { id: "p102", name: "Obed McCoy", team: "RR", role: "Bowler" },
  { id: "p103", name: "Kuldeep Yadav", team: "RR", role: "Bowler" },
  { id: "p104", name: "Ravichandran Ashwin", team: "RR", role: "All-rounder" },
  { id: "p105", name: "Jos Buttler", team: "RR", role: "Batter" },
  
  // Sunrisers Hyderabad
  { id: "p106", name: "Pat Cummins", team: "SRH", role: "All-rounder" },
  { id: "p107", name: "Heinrich Klaasen", team: "SRH", role: "Wicketkeeper" },
  { id: "p108", name: "Aiden Markram", team: "SRH", role: "Batter" },
  { id: "p109", name: "Abhishek Sharma", team: "SRH", role: "All-rounder" },
  { id: "p110", name: "Glenn Phillips", team: "SRH", role: "Batter" },
  { id: "p111", name: "Harry Brook", team: "SRH", role: "Batter" },
  { id: "p112", name: "Bhuvneshwar Kumar", team: "SRH", role: "Bowler" },
  { id: "p113", name: "T Natarajan", team: "SRH", role: "Bowler" },
  { id: "p114", name: "Mayank Markande", team: "SRH", role: "Bowler" },
  { id: "p115", name: "Adam Zampa", team: "SRH", role: "Bowler" },
  { id: "p116", name: "Marco Jansen", team: "SRH", role: "All-rounder" },
  { id: "p117", name: "Sanvvari Sharma", team: "SRH", role: "Bowler" },
  { id: "p118", name: "Rahul Tripathi", team: "SRH", role: "Batter" },
  { id: "p119", name: "Nitish Kumar Reddy", team: "SRH", role: "All-rounder" },
  { id: "p120", name: "Anmolpreet Singh", team: "SRH", role: "Batter" },
  
  // Punjab Kings
  { id: "p121", name: "Shikhar Dhawan", team: "PBKS", role: "Batter" },
  { id: "p122", name: "Jonny Bairstow", team: "PBKS", role: "Wicketkeeper" },
  { id: "p123", name: "Liam Livingstone", team: "PBKS", role: "Batter" },
  { id: "p124", name: "Arshdeep Singh", team: "PBKS", role: "Bowler" },
  { id: "p125", name: "Harpreet Brar", team: "PBKS", role: "Bowler" },
  { id: "p126", name: "Rabada", team: "PBKS", role: "Bowler" },
  { id: "p127", name: "Nathan Ellis", team: "PBKS", role: "Bowler" },
  { id: "p128", name: "Vaibhav Arora", team: "PBKS", role: "Bowler" },
  { id: "p129", name: "Jitesh Sharma", team: "PBKS", role: "Wicketkeeper" },
  { id: "p130", name: "Prabhsimran Singh", team: "PBKS", role: "Batter" },
  { id: "p131", name: "Bhanuka Rajapaksa", team: "PBKS", role: "Batter" },
  { id: "p132", name: "Shahrukh Khan", team: "PBKS", role: "All-rounder" },
  { id: "p133", name: "Ashutosh Sharma", team: "PBKS", role: "Batter" },
  { id: "p134", name: "Atharva Lomror", team: "PBKS", role: "All-rounder" },
  { id: "p135", name: "Moises Henriques", team: "PBKS", role: "All-rounder" },
  
  // Gujarat Titans
  { id: "p136", name: "Shubman Gill", team: "GT", role: "Batter" },
  { id: "p137", name: "Hardik Pandya", team: "GT", role: "All-rounder" },
  { id: "p138", name: "Rashid Khan", team: "GT", role: "All-rounder" },
  { id: "p139", name: "David Miller", team: "GT", role: "Batter" },
  { id: "p140", name: "Wriddhiman Saha", team: "GT", role: "Wicketkeeper" },
  { id: "p141", name: "Vijay Shankar", team: "GT", role: "All-rounder" },
  { id: "p142", name: "Darshan Nalkande", team: "GT", role: "Bowler" },
  { id: "p143", name: "Pradeep Sangwan", team: "GT", role: "Bowler" },
  { id: "p144", name: "Yash Dayal", team: "GT", role: "Bowler" },
  { id: "p145", name: "Sai Kishore", team: "GT", role: "Bowler" },
  { id: "p146", name: "Noor Ahmad", team: "GT", role: "Bowler" },
  { id: "p147", name: "Manish Pandey", team: "GT", role: "Batter" },
  { id: "p148", name: "Rahul Tewatia", team: "GT", role: "All-rounder" },
  { id: "p149", name: "Abhinav Manohar", team: "GT", role: "Batter" },
  { id: "p150", name: "Jayant Yadav", team: "GT", role: "Bowler" },
  
  // Additional Reserve Players
  { id: "p151", name: "Sanju Samson", team: "RR", role: "Wicketkeeper" },
  { id: "p152", name: "Ishan Kishan", team: "MI", role: "Wicketkeeper" },
  { id: "p153", name: "Rishabh Pant", team: "DC", role: "Wicketkeeper" },
  { id: "p154", name: "Washington Sundar", team: "GT", role: "All-rounder" },
  { id: "p155", name: "Siraj Mohammad", team: "RCB", role: "Bowler" },
  { id: "p156", name: "Jaydev Unadkat", team: "RR", role: "Bowler" },
  { id: "p157", name: "Prasidh Krishna", team: "RR", role: "Bowler" },
  { id: "p158", name: "Tushar Deshpande", team: "CSK", role: "All-rounder" },
  { id: "p159", name: "Sikandar Raza", team: "SRH", role: "All-rounder" },
  { id: "p160", name: "Rohan Kadam", team: "RCB", role: "Batter" },
  { id: "p161", name: "Karan Jadhav", team: "MI", role: "Batter" },
  { id: "p162", name: "Alex Hales", team: "CSK", role: "Batter" },
  { id: "p163", name: "Tom Curran", team: "DC", role: "All-rounder" },
  { id: "p164", name: "Dwaine Pretorius", team: "LSG", role: "All-rounder" },
  { id: "p165", name: "Reece Topley", team: "RCB", role: "Bowler" },
  { id: "p166", name: "Michael Vaughan", team: "RR", role: "Batter" },
  { id: "p167", name: "Lockie Ferguson", team: "KKR", role: "Bowler" },
  { id: "p168", name: "Rasikh Dar", team: "PBKS", role: "Bowler" },
  { id: "p169", name: "Siddarth Kaul", team: "SRH", role: "Bowler" },
  { id: "p170", name: "Anurith Negi", team: "GT", role: "Batter" },
  { id: "p171", name: "Piyush Chawla", team: "RR", role: "Bowler" },
  { id: "p172", name: "Moeen Ali", team: "CSK", role: "All-rounder" },
  { id: "p173", name: "Romesh Shepherd", team: "LSG", role: "Bowler" },
  { id: "p174", name: "Mitchell Santner", team: "CSK", role: "All-rounder" },
  { id: "p175", name: "Shardul Thakur", team: "CSK", role: "All-rounder" },
  { id: "p176", name: "Chris Woakes", team: "DC", role: "All-rounder" },
  { id: "p177", name: "Jason Roy", team: "PBKS", role: "Batter" },
  { id: "p178", name: "Mark Adair", team: "PBKS", role: "Bowler" },
  { id: "p179", name: "Brendon McCullum", team: "KKR", role: "Batter" },
  { id: "p180", name: "Ravi Ashwin", team: "RR", role: "All-rounder" },
  { id: "p181", name: "Axar Patel", team: "DC", role: "All-rounder" },
  { id: "p182", name: "Shreyas Iyer", team: "KKR", role: "Batter" },
  { id: "p183", name: "Jonny Bairstow", team: "PBKS", role: "Wicketkeeper" },
  { id: "p184", name: "Phil Salt", team: "KKR", role: "Batter" },
  { id: "p185", name: "Sunil Narine", team: "KKR", role: "All-rounder" },
  { id: "p186", name: "Aaron Finch", team: "RCB", role: "Batter" },
  { id: "p187", name: "Alex Carey", team: "MI", role: "Wicketkeeper" },
  { id: "p188", name: "Reece Topley", team: "RCB", role: "Bowler" },
  { id: "p189", name: "Ollie Pope", team: "RCB", role: "Batter" },
  { id: "p190", name: "Sam Billings", team: "KKR", role: "Wicketkeeper" },
  { id: "p191", name: "Eoin Morgan", team: "CSK", role: "Batter" },
  { id: "p192", name: "Peter Handscomb", team: "DC", role: "Batter" },
  { id: "p193", name: "Tom Lammonby", team: "RR", role: "Batter" },
  { id: "p194", name: "Jordan Cox", team: "KKR", role: "Wicketkeeper" },
  { id: "p195", name: "Aakash Chopra", team: "DC", role: "Batter" },
  { id: "p196", name: "Anmolpreet Singh", team: "MI", role: "Batter" },
  { id: "p197", name: "Dwayne Bravo", team: "CSK", role: "Bowler" },
  { id: "p198", name: "Pathum Nissanka", team: "GT", role: "Batter" },
  { id: "p199", name: "Oshada Fernando", team: "LSG", role: "Batter" },
  { id: "p200", name: "Dasun Shanaka", team: "RCB", role: "All-rounder" },
  { id: "p201", name: "Angelo Mathews", team: "CSK", role: "All-rounder" },
  { id: "p202", name: "Charith Asalanka", team: "RR", role: "Batter" },
  { id: "p203", name: "Kusal Perera", team: "DC", role: "Wicketkeeper" },
  { id: "p204", name: "Avishka Fernando", team: "PBKS", role: "Batter" },
  { id: "p205", name: "Dushmantha Chameera", team: "LSG", role: "Bowler" },
  { id: "p206", name: "Wanindu Hasaranga", team: "RCB", role: "All-rounder" },
  { id: "p207", name: "Chamika Karunaratne", team: "CSK", role: "All-rounder" },
  { id: "p208", name: "Nuwan Pradeep", team: "GT", role: "Bowler" },
  { id: "p209", name: "Lahiru Kumara", team: "MI", role: "Bowler" },
  { id: "p210", name: "Anura Lakmal", team: "SRH", role: "Batter" },
  { id: "p211", name: "Jean-Paul Duminy", team: "RR", role: "All-rounder" },
  { id: "p212", name: "Faf du Plessis", team: "RCB", role: "Batter" },
  { id: "p213", name: "David Miller", team: "GT", role: "Batter" },
  { id: "p214", name: "Aiden Markram", team: "SRH", role: "Batter" },
  { id: "p215", name: "Van der Dussen", team: "DC", role: "Batter" },
  { id: "p216", name: "Marco Jansen", team: "SRH", role: "All-rounder" },
  { id: "p217", name: "Sisanda Magala", team: "PBKS", role: "Bowler" },
  { id: "p218", name: "Lungi Ngidi", team: "CSK", role: "Bowler" },
  { id: "p219", name: "Gerald Coetzee", team: "MI", role: "Bowler" },
  { id: "p220", name: "Jason Holder", team: "PBKS", role: "All-rounder" },
  { id: "p221", name: "Odean Smith", team: "LSG", role: "All-rounder" },
  { id: "p222", name: "Romesh Shepherd", team: "LSG", role: "Bowler" },
  { id: "p223", name: "Pooran Nicholas", team: "LSG", role: "Batter" },
  { id: "p224", name: "Shimron Hetmyer", team: "DC", role: "Batter" },
  { id: "p225", name: "Sherfane Rutherford", team: "GT", role: "All-rounder" },
  { id: "p226", name: "Roston Chase", team: "CSK", role: "All-rounder" },
  { id: "p227", name: "Alzarri Joseph", team: "MI", role: "Bowler" },
  { id: "p228", name: "Carlos Brathwaite", team: "RR", role: "All-rounder" },
  { id: "p229", name: "Jofra Archer", team: "RR", role: "Bowler" },
  { id: "p230", name: "Reece Topley", team: "RCB", role: "Bowler" },
  { id: "p231", name: "Sam Curran", team: "CSK", role: "All-rounder" },
  { id: "p232", name: "Chris Woakes", team: "DC", role: "All-rounder" },
  { id: "p233", name: "Moeen Ali", team: "CSK", role: "All-rounder" },
  { id: "p234", name: "Joe Root", team: "RCB", role: "Batter" },
  { id: "p235", name: "James Anderson", team: "DC", role: "Bowler" },
  { id: "p236", name: "Dawid Malan", team: "LSG", role: "Batter" },
  { id: "p237", name: "Harry Brook", team: "SRH", role: "Batter" },
  { id: "p238", name: "Brendon McCullum", team: "KKR", role: "Batter" },
  { id: "p239", name: "Kane Williamson", team: "SRH", role: "Batter" },
  { id: "p240", name: "Travis Head", team: "RCB", role: "Batter" },
  { id: "p241", name: "Marnus Labuschagne", team: "CSK", role: "Batter" },
  { id: "p242", name: "Matthew Wade", team: "DC", role: "Wicketkeeper" },
  { id: "p243", name: "Steve Smith", team: "RR", role: "Batter" },
  { id: "p244", name: "Alex Hales", team: "KKR", role: "Batter" },
  { id: "p245", name: "Jason Roy", team: "PBKS", role: "Batter" },
  { id: "p246", name: "Liam Livingstone", team: "PBKS", role: "Batter" },
  { id: "p247", name: "Jos Buttler", team: "RR", role: "Batter" },
  { id: "p248", name: "Shai Hope", team: "GT", role: "Wicketkeeper" },
  { id: "p249", name: "Darren Bravo", team: "CSK", role: "Batter" },
  { id: "p250", name: "Marlon Samuels", team: "MI", role: "All-rounder" },
];

const fallbackTeams: BattleTeam[] = [
  { id: "t1", name: "Mumbai Indians", city: "Mumbai" },
  { id: "t2", name: "Chennai Super Kings", city: "Chennai" },
  { id: "t3", name: "Royal Challengers Bangalore", city: "Bengaluru" },
  { id: "t4", name: "Kolkata Knight Riders", city: "Kolkata" },
  { id: "t5", name: "Delhi Capitals", city: "Delhi" },
  { id: "t6", name: "Sunrisers Hyderabad", city: "Hyderabad" },
  { id: "t7", name: "Rajasthan Royals", city: "Jaipur" },
  { id: "t8", name: "Punjab Kings", city: "Mohali" },
  { id: "t9", name: "Lucknow Super Giants", city: "Lucknow" },
  { id: "t10", name: "Gujarat Titans", city: "Ahmedabad" },
];

const IPL_TEAM_NAMES = new Set([
  "Mumbai Indians",
  "Chennai Super Kings",
  "Royal Challengers Bangalore",
  "Kolkata Knight Riders",
  "Delhi Capitals",
  "Sunrisers Hyderabad",
  "Rajasthan Royals",
  "Punjab Kings",
  "Lucknow Super Giants",
  "Gujarat Titans",
]);

const MAX_PLAYERS = 5;
const MAX_TEAMS = 2;
const MAX_DISPLAYED_PLAYERS = 5;
const MAX_DISPLAYED_TEAMS = 10;

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const scoreTeamMatch = (name: string, city: string, query: string) => {
  const normalizedName = normalizeText(name);
  const normalizedCity = normalizeText(city);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;
  
  // Check name matches first (higher priority)
  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 1;
  if (normalizedName.includes(normalizedQuery)) return 2 + normalizedName.indexOf(normalizedQuery) / 100;
  
  // Check city matches (lower priority)
  if (normalizedCity === normalizedQuery) return 5;
  if (normalizedCity.startsWith(normalizedQuery)) return 6;
  if (normalizedCity.includes(normalizedQuery)) return 7 + normalizedCity.indexOf(normalizedQuery) / 100;
  
  return Number.POSITIVE_INFINITY;
};

const scorePlayerMatch = (name: string, query: string) => {
  const normalizedName = normalizeText(name);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;
  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 1;

  const words = normalizedName.split(" ");
  if (words.some((word) => word.startsWith(normalizedQuery))) return 2;

  const containsIndex = normalizedName.indexOf(normalizedQuery);
  if (containsIndex >= 0) return 3 + containsIndex / 100;

  return Number.POSITIVE_INFINITY;
};

// Players Icon
const PlayersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// Clubs Icon
const ClubsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const CreateBattle: React.FC<CreateBattleProps> = ({ players, teams }) => {
  const router = useRouter();
  const [playerData, setPlayerData] = useState<BattlePlayer[]>(fallbackPlayers);
  const [teamData, setTeamData] = useState<BattleTeam[]>(fallbackTeams);
  const [loading, setLoading] = useState(true);

  const [battleName, setBattleName] = useState("");
  const [battleType, setBattleType] = useState<"players" | "clubs">("players");
  const [playerSearch, setPlayerSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Invite friends state
  const [inviteInput, setInviteInput] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock existing user emails
  const existingEmails = [
    "john@example.com",
    "jane@example.com",
    "mike@example.com",
    "sarah@example.com",
    "david@example.com",
    "emma@example.com",
    "alex@example.com",
    "rachel@example.com",
    "chris@example.com",
    "lisa@example.com",
  ];

  // Fetch data from server (prefer player-profile/home and team360)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try player-profile home endpoint first (returns posts with playerName)
        const playerProfileRes = await fetch('/api/player-profile/home?limit=250').catch(() => null);
        if (playerProfileRes?.ok) {
          const json = await playerProfileRes.json();
          // expect { success, posts: HomeItem[] }
          const posts = json.posts || json.data || [];
          const mapped = posts.map((p: ApiPlayerItem, idx: number) => ({
            id: p.playerProfilesId || p.id || `pp_${idx}`,
            // normalize various possible name fields from different APIs
            name:
              p.playerName || p.profile?.name || p.player?.name || p.name || p.title || 'Unknown',
            team: p.team || p.logo || p.profile?.team || '',
            role: p.role || p.profile?.role || '',
          }));
          setPlayerData(mapped.length ? mapped : players?.length ? players : fallbackPlayers);
        } else {
          // Fallback to /api/players
          const playersRes = await fetch('/api/players').catch(() => null);
          if (playersRes?.ok) {
            const data = await playersRes.json();
            setPlayerData(data.data || (players?.length ? players : fallbackPlayers));
          } else {
            setPlayerData(players?.length ? players : fallbackPlayers);
          }
        }

        // Try team360 endpoint first
        const team360Res = await fetch('/api/team360?limit=100').catch(() => null);
        if (team360Res?.ok) {
          const j = await team360Res.json();
          const tdata = j.data || j.teams || j.items || [];
          const mappedT = tdata.map((t: ApiTeamItem, i: number) => ({
            id: t.id || `t_${i}`,
            name: t.name || t.teamName || 'Unknown',
            city: t.city || t.location || '',
          })).filter((team: BattleTeam) => IPL_TEAM_NAMES.has(team.name));
          setTeamData(mappedT.length ? mappedT : (teams?.length ? teams.filter((team) => IPL_TEAM_NAMES.has(team.name)) : fallbackTeams));
        } else {
          const teamsRes = await fetch('/api/teams').catch(() => null);
          if (teamsRes?.ok) {
            const data = await teamsRes.json();
            setTeamData((data.data || (teams?.length ? teams : fallbackTeams)).filter((team: BattleTeam) => IPL_TEAM_NAMES.has(team.name)));
          } else {
            setTeamData(teams?.length ? teams.filter((team) => IPL_TEAM_NAMES.has(team.name)) : fallbackTeams);
          }
        }
      } catch (error) {
        console.error('Error fetching battle data:', error);
        setPlayerData(players?.length ? players : fallbackPlayers);
        setTeamData(teams?.length ? teams.filter((team) => IPL_TEAM_NAMES.has(team.name)) : fallbackTeams);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [players, teams]);

  const filteredPlayers = useMemo(() => {
    const q = playerSearch.trim();
    const matches = q
      ? playerData
          .map((player) => ({
            player,
            score: scorePlayerMatch(player.name || "", q),
          }))
          .filter(({ score }) => Number.isFinite(score))
          .sort((left, right) => {
            if (left.score !== right.score) return left.score - right.score;
            return left.player.name.localeCompare(right.player.name);
          })
          .map(({ player }) => player)
      : playerData;
    return matches.slice(0, MAX_DISPLAYED_PLAYERS);
  }, [playerData, playerSearch]);

  const filteredTeams = useMemo(() => {
    const q = teamSearch.trim();
    const matches = q
      ? teamData
          .map((team) => ({
            team,
            score: scoreTeamMatch(team.name, team.city, q),
          }))
          .filter(({ score }) => Number.isFinite(score))
          .sort((left, right) => {
            if (left.score !== right.score) return left.score - right.score;
            return left.team.name.localeCompare(right.team.name);
          })
          .map(({ team }) => team)
      : teamData;
    return matches.slice(0, MAX_DISPLAYED_TEAMS);
  }, [teamData, teamSearch]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((current) => {
      if (current.includes(playerId)) {
        return current.filter((id) => id !== playerId);
      }
      if (current.length >= MAX_PLAYERS) {
        return current;
      }
      return [...current, playerId];
    });
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeams((current) => {
      if (current.includes(teamId)) {
        return current.filter((id) => id !== teamId);
      }
      if (current.length >= MAX_TEAMS) {
        return current;
      }
      return [...current, teamId];
    });
  };

  const currentPlayers = playerData.filter((p) => selectedPlayers.includes(p.id));
  const currentTeams = teamData.filter((t) => selectedTeams.includes(t.id));

  const selectedItems = battleType === "players" ? currentPlayers : currentTeams;
  const selectedCount = battleType === "players" ? selectedPlayers.length : selectedTeams.length;
  const maxCount = battleType === "players" ? MAX_PLAYERS : MAX_TEAMS;

  // Handle invite email input changes
  const handleInviteInputChange = (value: string) => {
    setInviteInput(value);
    
    if (value.trim()) {
      const lastEmail = value.split(',').pop()?.trim() || '';
      const filtered = existingEmails.filter(
        (email) =>
          email.toLowerCase().includes(lastEmail.toLowerCase()) &&
          !invitedEmails.includes(email)
      );
      setEmailSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setEmailSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add email from suggestion or input
  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    if (invitedEmails.includes(trimmedEmail)) {
      alert('Email already added');
      return;
    }

    setInvitedEmails([...invitedEmails, trimmedEmail]);
    setInviteInput('');
    setEmailSuggestions([]);
    setShowSuggestions(false);
  };

  // Remove email from invited list
  const removeEmail = (email: string) => {
    setInvitedEmails(invitedEmails.filter((e) => e !== email));
  };

  // Handle input key press (Enter to add email, comma to parse multiple)
  const handleInviteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = inviteInput.split(',').pop()?.trim();
      if (email) {
        addEmail(email);
      }
    }
  };

  const handleCreate = async () => {
    if (!battleName.trim()) {
      alert('Please enter a battle name');
      return;
    }

    if (selectedCount === 0) {
      alert('Please select at least one item');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: battleName,
          type: battleType,
          players: selectedPlayers,
          teams: selectedTeams,
          invitedEmails: invitedEmails,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // navigate back to fanbattle main page
        router.back();
      } else {
        alert(data?.error || 'Failed to create battle');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create battle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f12] to-[#1a1a1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-[#1a1a1e] text-white shadow-2xl border border-white/10">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#d75a2d] flex-shrink-0">
              <Image
                src="/images/battle.png"
                alt="Battle"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">Create Battle</h2>
          </div>
          <button
            onClick={() => router.back()}
            className="text-white hover:opacity-70 transition-opacity flex-shrink-0"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Battle Name Input */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Battle Name
            </label>
            <input
              type="text"
              value={battleName}
              onChange={(e) => setBattleName(e.target.value)}
              placeholder="e.g., Epic Showdown 2024"
              className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#666] focus:border-white/30 focus:bg-white/12 transition-colors"
            />
          </div>

          {/* Battle Type Tabs */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Battle Type
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setBattleType("players")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                  battleType === "players"
                    ? "border-[#d75a2d] bg-[#d75a2d]/20 text-[#d75a2d]"
                    : "border-white/15 bg-white/5 text-[#8a8a8a] hover:border-white/25"
                }`}
              >
                <PlayersIcon />
                <div className="text-left">
                  <div className="text-xs font-semibold">Players</div>
                  <div className="text-[10px] opacity-70">Max 5</div>
                </div>
              </button>
              <button
                onClick={() => setBattleType("clubs")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                  battleType === "clubs"
                    ? "border-[#d75a2d] bg-[#d75a2d]/20 text-[#d75a2d]"
                    : "border-white/15 bg-white/5 text-[#8a8a8a] hover:border-white/25"
                }`}
              >
                <ClubsIcon />
                <div className="text-left">
                  <div className="text-xs font-semibold">Clubs</div>
                  <div className="text-[10px] opacity-70">Max 2</div>
                </div>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              value={battleType === "players" ? playerSearch : teamSearch}
              onChange={(e) => {
                if (battleType === "players") {
                  setPlayerSearch(e.target.value);
                } else {
                  setTeamSearch(e.target.value);
                }
              }}
              placeholder={`Search ${battleType}...`}
              className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#666] focus:border-white/30 focus:bg-white/12 transition-colors"
            />
          </div>

          {/* Selection Header */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-semibold text-white">
              Select {battleType === "players" ? "Players" : "Clubs"}
            </h3>
            <span className="text-xs font-medium text-[#8a8a8a]">
              {selectedCount}/{maxCount} selected
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-2 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-sm text-[#8a8a8a]">
                Loading...
              </div>
            ) : (battleType === "players" ? filteredPlayers : filteredTeams).length > 0 ? (
              (battleType === "players" ? filteredPlayers : filteredTeams).map((item) => {
                const isSelected = battleType === "players"
                  ? selectedPlayers.includes(item.id)
                  : selectedTeams.includes(item.id);
                const isLimitReached = selectedCount >= maxCount;
                const isBlocked = !isSelected && isLimitReached;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-white/25 bg-white/8"
                        : isBlocked
                          ? "border-white/10 bg-white/3 opacity-60 cursor-not-allowed"
                          : "border-white/12 bg-white/4 hover:border-white/20 hover:bg-white/6"
                    }`}
                    onClick={() => {
                      if (isBlocked) {
                        return;
                      }
                      if (battleType === "players") {
                        togglePlayer(item.id);
                      } else {
                        toggleTeam(item.id);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={isBlocked}
                      title={isBlocked ? `Selection blocked: max ${maxCount} reached` : undefined}
                      className={`h-5 w-5 rounded accent-[#d75a2d] shrink-0 ${
                        isBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.name}
                      </p>
                      {battleType === "clubs" ? (
                        <p className="text-xs text-[#888]">
                          {(item as BattleTeam).city}
                        </p>
                      ) : null}
                      {isBlocked ? (
                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#ff8a80]">
                          Blocked - max {maxCount} selected
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-sm text-[#888]">
                No {battleType} found
              </div>
            )}
          </div>

          {/* Selected Chips */}
          {selectedItems.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d75a2d]/40 bg-[#d75a2d]/15 px-3 py-1.5 text-xs font-medium text-[#ff9a6c]"
                >
                  {item.name}
                  <button
                    onClick={() => {
                      if (battleType === "players") {
                        togglePlayer(item.id);
                      } else {
                        toggleTeam(item.id);
                      }
                    }}
                    className="text-[#d75a2d]/70 hover:text-[#d75a2d]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Invite Friends Section */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Invite Friend
            </label>
            <div className="relative">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => handleInviteInputChange(e.target.value)}
                onKeyDown={handleInviteKeyDown}
                onFocus={() => inviteInput.trim() && emailSuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="friend@email.com"
                className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#666] focus:border-white/30 focus:bg-white/12 transition-colors"
              />
              
              {/* Email Suggestions Dropdown */}
              {showSuggestions && emailSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/15 bg-[#1a1a1e] z-10 shadow-lg">
                  {emailSuggestions.map((email) => (
                    <button
                      key={email}
                      type="button"
                      onClick={() => addEmail(email)}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {email}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Invited Emails Chips */}
            {invitedEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {invitedEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d75a2d]/40 bg-[#d75a2d]/15 px-3 py-1.5 text-xs font-medium text-[#ff9a6c]"
                  >
                    {email}
                    <button
                      onClick={() => removeEmail(email)}
                      className="text-[#d75a2d]/70 hover:text-[#d75a2d]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div className="border-t border-white/10 px-6 py-5 shrink-0">
          <button
            onClick={handleCreate}
            disabled={submitting}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white transition-all active:scale-95 ${
              submitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#e91e8c] to-[#d75a2d] hover:shadow-lg hover:shadow-pink-900/40'
            }`}
          >
            <PlusIcon />
            {submitting ? 'Creating...' : 'Create & Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBattle;
