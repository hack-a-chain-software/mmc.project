import {
  PageHeader,
  PageFooter,
  Slider,
  Button,
  About,
  Title,
  Roadmap,
  SneakPeeks,
} from "@/components";

export const Index = () => {
  return (
    <main className="w-screen min-h-screen">
      <div
        className="
          bg-no-repeat bg-[url('/images/background-home.jpg')] bg-[length:100%_100%]
        "
      >
        <PageHeader />

        <Slider />

        <section
          className="
            flex flex-col items-center
            pt-[82px] pb-[296px]
            space-y-[60px]
            xl:space-y-[125px]
            mx-auto
            bg-no-repeat bg-[url('/svgs/clouds.svg')] bg-[length:700px_600px] md:bg-[length:auto_auto] bg-[center_top_190px]
          "
        >
          <div className="xl:min-h-[500px] px-[30px] xl:px-0">
            <img
              src="./images/hero.webp"
              loading="eager"
              className="xl:max-w-[1129px] xl:mx-auto"
            />
          </div>

          <div className="flex flex-col space-y-[12px] items-center xl:flex-row xl:space-y-0 xl:space-x-[40px]">
            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[16px] sm:text-[22px]">
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => {}}
                className="text-[16px] sm:text-[22px] h-[60px] border-[2px] font-[400] shadow-0 px-[32px] md:px-0 md:w-[375px]"
              >
                Join the whitelist
              </Button>
            </div>

            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[16px] sm:text-[22px]">
                Limited supply
              </span>
            </div>
          </div>
        </section>

        <div className="w-full max-w-[1920px] mx-auto">
          <img src="./svgs/silhouette.svg" className="w-full" />
        </div>
      </div>

      <div
        id="the-case"
        className="container mx-auto mt-[-10%] xl:mt-[-20%] lg:mb-[200px] mb-[80px] px-[30px] sm:px-0"
      >
        <section className="w-full">
          <Title>The Case</Title>

          <div className="mt-[-65px] flex flex-col items-center">
            <div className="text-white text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px] font-[300] text-center flex flex-col space-y-[52px] mb-[50px]">
              <span>
                John Norris, a reporter for the Durum County Times and community
                pest, was discovered in the parking lot of the new FSM
                Superstore, apparently MURDERED.
              </span>
              <span>
                Under the pretense that he was covering the store’s grand
                opening, John had <br /> actually been investigating a possible
                conspiracy after receiving an email with the subject heading:
              </span>
            </div>

            <div className="flex flex-col space-y-[25px] text-center lg:space-y-0 lg:flex-row items-center lg:space-x-[25px] mb-[50px]">
              <div className="h-[95px] w-[95px] bg-[#A500FB] rounded-full border flex items-center justify-center">
                <img
                  loading="lazy"
                  src="./svgs/question.svg"
                  className="relative left-[4px] h-[90px]"
                />
              </div>

              <div className="border-y-[1px] py-[8px]">
                <span className="text-white text-[16px] sm:text-[22px] md:text-[28px] xl:text-[40px]">
                  THERE’S MORE THAN A STORE
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-white text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px] font-[300]">
                Police Chief Ima Resting has requested the assistance of public
                volunteers to help in solving this high-profile case.
              </span>
            </div>
          </div>
        </section>
      </div>

      <div
        id="how-to-play"
        className="container mx-auto relative overflow-hidden lg:mb-[200px] mb-[80px] px-[30px] sm:px-0"
      >
        <section>
          <Title>How to Play</Title>

          <About />
        </section>
      </div>

      <div
        id="roadmap"
        className="container mx-auto relative overflow-hidden lg:mb-[200px] mb-[40px]"
      >
        <section>
          <img
            src="./images/pins.png"
            className="hidden xl:block absolute scale-[1.05] left-[40px] top-[85px] 2xl:top-[65px]"
          />

          <Title>Roadmap</Title>

          <Roadmap />
        </section>
      </div>

      <div
        id="sneak-peeks"
        className="container mx-auto pb-[80px] lg:pb-[250px] bg-[url('/svgs/bricks.svg')] bg-[length:100%_auto] xl:bg-[length:100%_auto] px-[30px] sm:px-0"
      >
        <section>
          <Title className="pb-[239px]">Sneak Peeks</Title>

          <SneakPeeks />
        </section>
      </div>

      <PageFooter />
    </main>
  );
};

export default Index;
