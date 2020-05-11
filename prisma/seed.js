// @ts-check
'use strict';

const {prisma} = require('../apollo/src/generated/prisma-client');

async function main() {
  const user = await prisma.createUser({
    oktaId: 'testId1',
    firstName: 'Detroit Experience Factory',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580757435/wierq7pulh1irmhsfygd.jpg',
  });
  const user1 = await prisma.createUser({
    oktaId: 'testId2',
    firstName: 'Ray',
    lastName: 'Batra',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580754066/srqisgiplumij6jzkzc1.jpg',
  });
  const user3 = await prisma.createUser({
    oktaId: 'testId3',
    firstName: 'Historic North End Alliance',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580757510/u5eukn21j7ebkbs0len6.png',
  });
  const user4 = await prisma.createUser({
    oktaId: 'testId4',
    firstName: 'Michigan Urban Farming Initiative',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580761429/tso2fryjzewzsmek1wxh.jpg',
  });
  const user5 = await prisma.createUser({
    oktaId: 'testId5',
    firstName: 'Lower North End Block Club',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580759636/mdsb3xiycc5iwgcavfr7.png',
  });
  const user6 = await prisma.createUser({
    oktaId: 'testId6',
    firstName: 'Eastern Market Partnership',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/v1580761469/jd3al7cnhnu962pkmmsr.svg',
  });
  const user7 = await prisma.createUser({
    oktaId: 'testId7',
    firstName: 'Community Calendar',
    profileImage:
      'https://res.cloudinary.com/communitycalendar/image/upload/c_scale,w_70/v1580068501/C_ncfz11.svg',
  });

  // tag seeds

  const tag1 = await prisma.createTag({
    title: 'art',
  });
  const tag2 = await prisma.createTag({
    title: 'beer',
  });
  const tag3 = await prisma.createTag({
    title: 'block club',
  });
  const tag4 = await prisma.createTag({
    title: 'code',
  });
  const tag5 = await prisma.createTag({
    title: 'community',
  });
  const tag6 = await prisma.createTag({
    title: 'history',
  });
  const tag7 = await prisma.createTag({
    title: 'downtown',
  });
  const tag8 = await prisma.createTag({
    title: 'architecture',
  });
  const tag9 = await prisma.createTag({
    title: 'competition',
  });
  const tag10 = await prisma.createTag({
    title: 'dancing',
  });
  // const tag11 = await prisma.createTag({
  //   title: "downtown"
  // })
  const tag12 = await prisma.createTag({
    title: 'engineering',
  });
  const tag13 = await prisma.createTag({
    title: 'family',
  });
  const tag14 = await prisma.createTag({
    title: 'fireworks',
  });
  const tag15 = await prisma.createTag({
    title: 'food',
  });
  const tag16 = await prisma.createTag({
    title: 'free',
  });
  const tag17 = await prisma.createTag({
    title: 'heritage',
  });
  const tag18 = await prisma.createTag({
    title: 'hotdog',
  });
  const tag19 = await prisma.createTag({
    title: 'kids',
  });
  const tag20 = await prisma.createTag({
    title: 'market',
  });
  const tag21 = await prisma.createTag({
    title: 'music',
  });
  const tag22 = await prisma.createTag({
    title: 'neighborhood',
  });
  const tag23 = await prisma.createTag({
    title: 'STEM',
  });
  const tag24 = await prisma.createTag({
    title: 'teenagers',
  });
  const tag25 = await prisma.createTag({
    title: 'oktoberfest',
  });

  //Dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start1 = new Date(today);
  start1.setDate(start1.getDate() + 7);
  start1.setHours(start1.getHours() + 12);
  const end1 = new Date(today);
  end1.setDate(end1.getDate() + 7);
  end1.setHours(end1.getHours() + 15);

  const start2 = new Date(today);
  start2.setDate(start2.getDate() + 8);
  start2.setHours(start2.getHours() + 18);
  const end2 = new Date(today);
  end2.setDate(end2.getDate() + 8);
  end2.setHours(end2.getHours() + 19);

  const start3 = new Date(today);
  start3.setDate(start3.getDate() + 12);
  start3.setHours(start3.getHours() + 8);
  const end3 = new Date(today);
  end3.setDate(end3.getDate() + 12);
  end3.setHours(end3.getHours() + 10);

  const start4 = new Date(today);
  start4.setDate(start4.getDate() + 14);
  start4.setHours(start4.getHours() + 20);
  const end4 = new Date(today);
  end4.setDate(end4.getDate() + 14);
  end4.setHours(end4.getHours() + 22);

  const start5 = new Date(today);
  start5.setDate(start5.getDate() + 20);
  start5.setHours(start5.getHours() + 2);
  const end5 = new Date(today);
  end5.setDate(end5.getDate() + 20);
  end5.setHours(end5.getHours() + 5);

  const start6 = new Date(today);
  start6.setDate(start6.getDate() + 21);
  start6.setHours(start6.getHours() + 12);
  const end6 = new Date(today);
  end6.setDate(end6.getDate() + 21);
  end6.setHours(end6.getHours() + 15);

  const start7 = new Date(today);
  start7.setDate(start7.getDate() + 22);
  start7.setHours(start7.getHours() + 11);
  const end7 = new Date(today);
  end7.setDate(end7.getDate() + 22);
  end7.setHours(end7.getHours() + 12);

  const start8 = new Date(today);
  start8.setDate(start8.getDate() + 28);
  start8.setHours(start8.getHours() + 8);
  const end8 = new Date(today);
  end8.setDate(end8.getDate() + 28);
  end8.setHours(end8.getHours() + 20);

  const start9 = new Date(today);
  start9.setDate(start9.getDate() + 30);
  start9.setHours(start9.getHours() + 12);
  const end9 = new Date(today);
  end9.setDate(end1.getDate() + 30);
  end1.setHours(end1.getHours() + 15);

  const start10 = new Date(today);
  start10.setDate(start10.getDate() + 40);
  start10.setHours(start10.getHours() + 12);
  const end10 = new Date(today);
  end10.setDate(end10.getDate() + 40);
  end10.setHours(end10.getHours() + 15);

  const start11 = new Date(today);
  start11.setDate(start11.getDate() + 45);
  start11.setHours(start11.getHours() + 12);
  const end11 = new Date(today);
  end11.setDate(end11.getDate() + 45);
  end11.setHours(end11.getHours() + 15);

  // Event 1
  const event1 = await prisma.createEvent({
    index:
      'art,architect,downtown,walk,tour,detroit,city,rich,hist,grand,build,vibr,surround,publ,spac,expery,fact,are,expl,gre,contribut,prol,emerg,',
    title: 'Art & Architecture - Downtown Walking Tour',
    description:
      'Detroit is a city rich in history, grand buildings, and vibrant art surrounding public spaces. Walk with Detroit Experience Factory through the downtown area as we explore some of the great contributions of both prolific architects and emerging artists.',
    start: start1.toISOString(),
    end: end1.toISOString(),
    ticketPrice: 0.0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F69917729%2F89373299245%2F1%2Foriginal.jpg?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C693%2C4000%2C2000&s=94184073d91c25306d22d1b0401cfea9',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    urls: {
      create: [
        {
          url:
            'https://www.eventbrite.com/e/art-architecture-downtown-walking-tour-tickets-70525424443',
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Roasting Plant',
          streetAddress: '600 Woodward Avenue',
          city: 'Detroit',
          zipcode: 48202,
          state: 'MI',
          latitude: 42.330511,
          longitude: -83.045427,
        },
      ],
    },
    tags: {
      connect: [
        {title: 'art'},
        {title: 'history'},
        {title: 'downtown'},
        {title: 'architecture'},
      ],
    },
  });

  // Event-2
  const event2 = await prisma.createEvent({
    index:
      ',fre,learn,cod,workshop,begin,consid,car,chang,nee,ad,new,skil,mov,job,try,comput,program,hour,lov,intro,detroit,build,laugh,alongsid,oth,on,design,wil,includ,introduc,html,',
    title: 'FREE Learn to Code Workshop for Beginners',
    description:
      'Considering a career change?\n\nNeed to add new skills to move up at your job?\n\nTry computer programming in a few hours, for free—at the most loved intro to coding workshop in Detroit.\n\nLearn, build, and laugh alongside others at one of our intro workshops. See if coding is for you!\n\nThis workshop is designed for beginners and will include an introduction to HTML.',
    start: start2.toISOString(),
    end: end2.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580752915/xljk6pcnoeeimjgos338.png',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    urls: {
      create: [
        {
          url: 'https://www.meetup.com/ShiftUp/events/268381385/',
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Shift_Up',
          streetAddress: '4219 Woodward Ave',
          streetAddress2: '2nd Floor',
          city: 'Detroit',
          zipcode: 48201,
          state: 'MI',
          latitude: 42.351766,
          longitude: -83.061468,
        },
      ],
    },
    tags: {connect: [{title: 'free'}, {title: 'code'}, {title: 'community'}]},
  });

  // Event-3

  const event3 = await prisma.createEvent({
    index:
      ',hist,nor,end,al,month,meet,hne,commun,fo,concern,resid,defin,cre,speak,work,on,heart,detroit,wil,block,club,group,assocy,within,throughout,city,plan,educ,achiev,object,',
    title: 'Historic North End Alliance Monthly Meeting',
    description:
      'The Historic North End Alliance (HNEA) is a community of concerned North End residents who are defining, creating, speaking, and working as one community in the heart of Detroit. The HNEA will work with all Block Clubs, Community Groups/Associations and Allies within the North End and throughout the city; to plan, educate, and achieve objectives.',
    start: start3.toISOString(),
    end: end3.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580757979/hcqh4vfifqibez8cpg2s.png',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    urls: {
      create: [
        {
          url: 'https://www.facebook.com/HistoricNorthEndAlliance/',
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Metropolitan United Methodist Church',
          streetAddress: '8000 Woodward Ave',
          streetAddress2: '',
          city: 'Detroit',
          zipcode: 48202,
          state: 'MI',
          latitude: 42.374651,
          longitude: -83.075597,
        },
      ],
    },
    tags: {connect: [{title: 'community'}, {title: 'heritage'}]},
  });

  // Event-4

  const event4 = await prisma.createEvent({
    index:
      ',low,nor,end,block,club,meet,form,horton,cust,bethun,oakland,hcbo,first,monday,mon,resid,hom,discuss,commun,ev,concern,coordin,city,council,govern,ampl,perspect,',
    title: 'Lower North End Block Club Meeting',
    description:
      "The Lower North End Block Club, formerly the Horton-Custer-Bethune-Oakland (HCBO) Block Club, meetings the first Monday of each month at a resident's home to discuss community events and concerns. The Block Club coordinates communication with the city council and city government to amplify residents' concerns and perspectives.\n",
    start: start4.toISOString(),
    end: end4.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580760121/catjrb7rbjcn4otcmw87.png',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: {id: user.id}},
    locations: {
      create: [
        {
          name: 'Resident Home',
          streetAddress: '320 Horton Ave',
          streetAddress2: '',
          city: 'Detroit',
          zipcode: 48202,
          state: 'MI',
          latitude: 42.372462,
          longitude: -83.069376,
        },
      ],
    },
    tags: {
      connect: [
        {title: 'block club'},
        {title: 'community'},
        {title: 'neighborhood'},
      ],
    },
  });

  // Event-5

  const event5 = await prisma.createEvent({
    index:
      'eastern,market,saturday,attend,expery,undeny,detroit,225,vend,shar,produc,story,40,000,visit,on,day,busy,season,tradit,cornerston,city,125,year,cruc,mit,nour,healthy,wealthy,happy,wond,hour,map,park,pet,someth,els,regard,thing,know,pag,answ,head,',
    title: 'Eastern Market Saturday Market',
    description:
      'Attending our Saturday Market is an experience that is undeniably Detroit. Over 225 market vendors share their produce and stories with up to 40,000 visitors in one day during our busy season. The tradition of this market has been a cornerstone of the city for 125 years and is crucial to our mission of nourishing a healthier, wealthier, and happier city.\n\nWondering about hours, maps, parking, pets, or something else regarding your visit? Visit our things to know page for all the answers before heading out!',
    start: start5.toISOString(),
    end: end5.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580762038/d36a2tzrplgxrx3cxbfm.jpg',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Eastern Market',
          streetAddress: '2611 Russell St',
          streetAddress2: 'All Sheds',
          city: 'Detroit',
          zipcode: 48207,
          state: 'MI',
          latitude: 42.34641,
          longitude: -83.0406,
        },
      ],
    },
    tags: {connect: [{title: 'community'}, {title: 'food'}, {title: 'market'}]},
  });

  //  Event-6

  const event6 = await prisma.createEvent({
    index:
      ',3d,design,tinkercad,us,model,softw,cre,object,print,build,thin,lay,plast,form,fre,program,you,ag,14,cal,313,481,1409,inform',
    title: '3D Design with TinkerCAD',
    description:
      'Use TinkerCAD modeling software to create objects that can be 3D printed. 3D printers build up thin layers of plastic to form objects. Free program for youth ages 8-14, Call 313-481-1409 for more information',
    start: start6.toISOString(),
    end: end6.toISOString(),
    ticketPrice: 0.0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F84135113%2F293621734690%2F1%2Foriginal.20191210-171159?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C84%2C224%2C112&s=cf869634d7a67a925a7db1b8ad861f53',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    urls: {
      create: [
        {
          url:
            'https://www.eventbrite.com/e/3d-design-with-tinkercad-tickets-85556223969',
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: "Detroit Main Library, Children's Room",
          streetAddress: '5201 Woodward Avenue',
          city: 'Detroit',
          zipcode: 48202,
          state: 'MI',
          latitude: 42.358385,
          longitude: -83.066701,
        },
      ],
    },
    tags: {
      connect: [
        {title: 'kids'},
        {title: 'teenagers'},
        {title: 'STEM'},
        {title: 'engineering'},
      ],
    },
  });

  // Event-7

  const event7 = await prisma.createEvent({
    index:
      ',fre,introduc,cod,workshop,grand,circ,look,transit,car,tech,let,us,help,journey,2020,wil,on,mil,op,comput,program,job,aim,fil,posit,tim,believ,anyon,becom,develop',
    title: 'FREE Introduction to Coding Workshop Grand Circus',
    description:
      'Looking to transition to a career in tech? Let us help you on your journey! In 2020, there will be over one million open computer-programming jobs. Here at Grand Circus, we are aiming to help fill those positions, one coder at a time. We believe anyone can become a developer.',
    start: start7.toISOString(),
    end: end7.toISOString(),
    ticketPrice: 0.0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580152827/zaw0ehnfy5hnqefjchx2.jpg',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Grand Circus Detroit',
          streetAddress: '1570 Woodward Ave',
          city: 'Detroit',
          zipcode: 48226,
          state: 'MI',
          latitude: 42.3344,
          longitude: -83.04905,
        },
      ],
    },
    tags: {connect: [{title: 'code'}, {title: 'free'}]},
  });

  //  Event-8

  const event8 = await prisma.createEvent({
    index:
      ',independ,day,frankenmu,firework,2020,enjoy,fre,act,5p,11p,july,includ,infl,kid,food,entertain,spectacul,display',
    title: 'Independence Day Frankenmuth Fireworks 2020',
    description:
      'Enjoy FREE activities from 5p-11p on July 4 including inflatables for kids, food, entertainment, and a Spectacular Fireworks Display',
    start: start8.toISOString(),
    end: end8.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580752974/rndvvk2idr70wfpuzu7s.png',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'Heritage Park',
          streetAddress: '601 Weiss Street',
          streetAddress2: '',
          city: 'Frankenmuth',
          zipcode: 48734,
          state: 'MI',
          latitude: 43.330878,
          longitude: -83.735908,
        },
      ],
    },
    tags: {connect: [{title: 'kids'}, {title: 'fireworks'}, {title: 'food'}]},
  });

  // Event-9

  const event9 = await prisma.createEvent({
    index:
      ',oktoberfest,st,joseph,or,ground,detroit,church,wil,host,stein,hold,contest,kid,are,vend,liv,mus,dant,food,drink,insid,ensembl,tour,build',
    title: 'Oktoberfest at St. Joseph Oratory',
    description:
      'The grounds of this Detroit church will host a stein-holding contest, a kids area, vendors, live music, dancing, food and drink. Inside the church there are live musical ensembles and tours of the building',
    start: start9.toISOString(),
    end: end9.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580752094/hmvpumh6zou94nlvpztv.jpg',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: [{id: user.id}]},
    locations: {
      create: [
        {
          name: 'St. Joseph Oratory',
          streetAddress: '1828 Jay Street',
          streetAddress2: '',
          city: 'Detroit',
          zipcode: 48207,
          state: 'MI',
          latitude: 42.345458,
          longitude: -83.03551,
        },
      ],
    },
    tags: {
      connect: [{title: 'oktoberfest'}, {title: 'beer'}, {title: 'dancing'}],
    },
  });

  //  Event-10

  const event10 = await prisma.createEvent({
    index:
      'hot,dog,eat,contest,doz,coney,doesn,faz,an,am,island,challeng,aug,29,cal,nam,ten,year,competit,giv,10,minut,down,top,chil,mustard,on,win,get,weekend,trip,las,vega,two,fre,meal,champ,belt',
    title: 'Hot Dog Eating Contest',
    description:
      "If eating a dozen or so coney dogs doesn't faze you, the annual American Coney Island coney dog eating challenge on Aug. 29 is calling your name. \n\nNow in its tenth year, the yearly competition gives eaters 10 minutes to down as many hot dogs topped with chili, mustard and onions as they can. This year's winner gets a weekend trip to Las Vegas for two, free American Coney Island meals for a year and the championship belt. ",
    start: start10.toISOString(),
    end: end10.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580762729/gjmce6xoz2blud8atkso.jpg',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: {id: user.id}},
    locations: {
      create: [
        {
          name: 'American Coney Island',
          streetAddress: '114 W. Lafayette',
          streetAddress2: '',
          city: 'Detroit',
          zipcode: 48207,
          state: 'MI',
          latitude: 42.33153,
          longitude: -83.04844,
        },
      ],
    },
    tags: {
      connect: [{title: 'food'}, {title: 'hotdog'}, {title: 'competition'}],
    },
  });

  //  Event-11

  const event11 = await prisma.createEvent({
    index:
      ',walk,oceansid,enjoy,tim,outsid,oc,sid,feel,fre,bring,famy,fun,everyon,',
    title: 'Walk to the Oceanside',
    description:
      'Come enjoy some time outside on our walk to the ocean side. Feel free to bring your family and have fun with everyone.',
    start: start11.toISOString(),
    end: end11.toISOString(),
    ticketPrice: 0,
    creator: {connect: {id: user.id}},
    eventImages: {
      create: [
        {
          url:
            'https://res.cloudinary.com/communitycalendar/image/upload/v1580749924/ccw8ebtvzxtoid7jqwaq.jpg',
          creator: {connect: {id: user.id}},
        },
      ],
    },
    admins: {connect: {id: user.id}},
    locations: {
      create: [
        {
          name: 'Pacific Ocean',
          streetAddress: 'La Push',
          streetAddress2: '',
          city: 'La Push',
          zipcode: 98350,
          state: 'WA',
          latitude: 47.91,
          longitude: -124.64,
        },
      ],
    },
    tags: {connect: [{title: 'kids'}, {title: 'family'}]},
  });
}

main().catch(e => console.error(e));
