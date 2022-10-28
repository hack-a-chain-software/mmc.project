import {
  Slider,
  Button,
  About,
  Title,
  Roadmap,
  SneakPeeks,
  FadeInTransition,
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

        <div className="absolute top-[100px] z-[0] left-0 right-0 max-w-screen overflow-hidden flex items-center justify-center">
          <img
            src="/svgs/clouds.svg"
            className="relative w-full max-w-[1920px]"
          />
        </div>

        <section
          className="
            z-[2]
            relative
            flex flex-col items-center
            pt-[64px]
            space-y-[60px]
            mx-auto
          "
        >
          <div className="px-[30px] xl:px-0">
            <img
              src="./images/hero.webp"
              loading="eager"
              className="w-[64vw] max-w-[820px] xl:mx-auto"
            />
          </div>

          <div className="flex flex-col space-y-[12px] items-center xl:flex-row xl:space-y-0 xl:space-x-[40px]">
            <div>
              <span className="uppercase text-white font-[400] leading-[30px] text-[15px] sm:text-[22px]">
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => {}}
                className="text-[16px] sm:text-[22px] h-[60px] border-[2px] font-[400] shadow-0 px-[24px] h-[52px]"
              >
                Join the Collective
              </Button>
            </div>

            <div>
              <span className="uppercase text-white font-[400] leading-[30px] text-[15px] sm:text-[22px]">
                Limited supply
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-[1920px] z-[2] relative pt-[140px] mx-auto">
          <img src="./svgs/silhouette.svg" className="shrink-0" />
        </div>
      </div>

      <div
        id="the-case"
        className="container mx-auto mb-[200px] px-[30px] xl:px-0 max-w-[1280px] z-[2] relative pt-[56px]"
      >
        <FadeInTransition>
          <section className="w-full">
            <Title>The Case</Title>

            <div className="flex flex-col items-center space-y-[56px]">
              <div className="text-white text-[16px] md:text-[22px] md:leading-[38px] font-[300] text-center flex flex-col space-y-[40px]">
                <span>
                  John Norris, a reporter for the Durum County Times and
                  community pest, was discovered in the parking lot of the new
                  FSM Superstore, apparently MURDERED.
                </span>
                <span>
                  Under the pretense that he was covering the store’s grand
                  opening, John had actually been investigating a possible
                  conspiracy after receiving an email with the <br /> subject
                  heading:
                </span>
              </div>

              <div className="">
                <span className="text-[28px] font-heavy text-white text-center">
                  "THERE’S MORE THAN A STORE..."
                </span>
              </div>

              <div className="text-center">
                <span className="text-white text-[16px] md:text-[22px] md:leading-[38px] font-[300] text-center">
                  Police Chief Ima Resting has requested the assistance of{" "}
                  <br /> public volunteers to help in solving this high-profile
                  case.
                </span>
              </div>

              <div className="h-[100px] w-[100px] bg-[#A500FB] rounded-full border flex items-center justify-center">
                <img
                  loading="lazy"
                  src="./svgs/question.svg"
                  className="relative left-[4px] h-[100px] w-[100px]"
                />
              </div>
            </div>
          </section>
        </FadeInTransition>
      </div>

      <div
        id="how-to-play"
        className="container mx-auto relative overflow-hidden px-[30px] xl:px-0 max-w-screen-xl"
      >
        <FadeInTransition>
          <section>
            <Title>How to Play</Title>

            <About />
          </section>
        </FadeInTransition>
      </div>

      <div
        id="roadmap"
        className="container mx-auto relative overflow-hidden mb-[23px] px-[30px] xl:px-0 max-w-screen-xl pt-[141px]"
      >
        <FadeInTransition>
          <section className="relative">
            <img
              src="./images/pins.png"
              className="hidden xl:block absolute scale-[1] left-[18px] top-[-17px]"
            />

            <Title>Roadmap</Title>

            <Roadmap />
          </section>
        </FadeInTransition>
      </div>

      <div
        id="sneak-peeks"
        className="container mx-auto pb-[71px] mb-[54px] bg-[url('/svgs/bricks.svg')] bg-[length:auto_100%] px-[30px] xl:px-0 pt-[165px]"
      >
        <FadeInTransition>
          <section className="container mx-auto max-w-screen-xl">
            <Title>Sneak Peeks</Title>

            <SneakPeeks />
          </section>
        </FadeInTransition>
      </div>
    </main>
  );
};

export default Index;
