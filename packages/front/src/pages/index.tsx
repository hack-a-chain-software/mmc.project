import {
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
          bg-no-repeat bg-[url('/images/background-home.jpg')] bg-[length:100%_100%] pt-[117px] min-h-[100vh]
        "
      >
        <Slider />

        <section
          className="
            flex flex-col items-center
            pt-[78px]
            space-y-[60px]
            xl:space-y-[80px]
            mx-auto
            bg-no-repeat bg-[url('/svgs/clouds.svg')] bg-[length:700px_600px] md:bg-[length:auto_auto] bg-[center_top_190px]
          "
        >
          <div className="px-[30px] xl:px-0">
            <img
              src="./images/hero.webp"
              loading="eager"
              className="xl:max-w-[1024px] xl:mx-auto"
            />
          </div>

          <div className="flex flex-col space-y-[12px] items-center xl:flex-row xl:space-y-0 xl:space-x-[40px]">
            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[15px] sm:text-[15px]">
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => console.log("")}
                className="text-[16px] sm:text-[15px] h-[60px] border-[2px] font-[400] shadow-0 px-[17px] h-[40px]"
              >
                Join the whitelist
              </Button>
            </div>

            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[15px] sm:text-[15px]">
                Limited supply
              </span>
            </div>
          </div>
        </section>

        <div className="w-full overflow-hidden pointer-events-none max-h-[470px]">
          <img
            src="./svgs/scene-1_expanded_silhouette.svg"
            className="shrink-0"
          />
        </div>
      </div>

      <div
        id="the-case"
        className="container mx-auto mb-[100px] px-[30px] sm:px-0 max-w-[930px] z-[2] relative pt-[56px]"
      >
        <section className="w-full">
          <Title>The Case</Title>

          <div className="flex flex-col items-center space-y-[50px]">
            <div className="text-white text-[16px] sm:text-[22px] md:text-[15px] md:leading-[20px] font-[300] text-center flex flex-col space-y-[22px]">
              <span>
                John Norris, a reporter for the Durum County Times and community
                pest, was discovered in the parking lot of the new FSM
                Superstore, apparently MURDERED.
              </span>
              <span>
                Under the pretense that he was covering the store’s grand
                opening, John had actually been investigating a possible
                conspiracy after receiving an email with the subject heading:
              </span>
            </div>

            <div className="flex flex-col space-y-[20px] text-center lg:space-y-0 space-x-[20px] lg:flex-row items-center">
              <div className="h-[65px] w-[65px] bg-[#A500FB] rounded-full border flex items-center justify-center">
                <img
                  loading="lazy"
                  src="./svgs/question.svg"
                  className="relative left-[4px] h-[65px] w-[65px]"
                />
              </div>

              <div className="border-y-[1px] py-[8px]">
                <span className="text-white text-[20px] leading-[24px]">
                  THERE’S MORE THAN A STORE
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-white text-[16px] sm:text-[22px] md:text-[15px] md:leading-[20px] font-[300]">
                Police Chief Ima Resting has requested the assistance of public
                volunteers <br /> to help in solving this high-profile case.
              </span>
            </div>
          </div>
        </section>
      </div>

      <div
        id="how-to-play"
        className="container mx-auto relative overflow-hidden px-[30px] sm:px-0 max-w-screen-lg"
      >
        <section>
          <Title>How to Play</Title>

          <About />
        </section>
      </div>

      <div
        id="roadmap"
        className="container mx-auto relative overflow-hidden mb-[23px] max-w-screen-lg pt-[100px]"
      >
        <section className="relative">
          <img
            src="./images/pins.png"
            className="hidden xl:block absolute scale-[1] left-[18px] top-[-17px]"
          />

          <Title>Roadmap</Title>

          <Roadmap />
        </section>
      </div>

      <div
        id="sneak-peeks"
        className="container mx-auto pb-[71px] mb-[54px] bg-[url('/svgs/bricks.svg')] bg-[length:auto_100%] px-[30px] sm:px-0 pt-[165px]"
      >
        <section className="container mx-auto max-w-screen-lg">
          <Title className="pb-[239px]">Sneak Peeks</Title>

          <SneakPeeks />
        </section>
      </div>
    </main>
  );
};

export default Index;
