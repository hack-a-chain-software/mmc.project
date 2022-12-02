import {
  Slider,
  Button,
  About,
  Title,
  Roadmap,
  SneakPeeks,
  FadeInTransition,
} from '@/components';

export const Index = (props) => {
  console.log(props, 'pagepros');

  return (
    <div
      className="mx-auto bodypage"
    >
      <div
        className="
          bg-no-repeat bg-[url('/images/background-home.jpg')] bg-[length:100%_100%] pt-[110px] min-h-[100vh]
        "
      >
        <Slider />

        <div className="absolute top-[100px] z-[0] left-0 right-0 max-w-screen overflow-hidden flex items-center justify-center">
          <img
            src="/svgs/clouds.svg"
            className="relative w-full max-w-[1920px] min-w-screen"
          />
        </div>

        <section
          className="
            z-[2]
            relative
            flex flex-col items-center
            pt-[32px]
            space-y-[60px]
            mx-auto
            mb-[307px]
          "
        >
          <div className="px-[30px] xl:px-0">
            <img
              src="./images/hero.webp"
              loading="eager"
              className="w-[80vw] max-w-[52rem] xl:mx-auto"
            />
          </div>

          <div className="flex flex-col space-y-[12px] items-center xl:flex-row xl:space-y-0 xl:space-x-[40px]">
            <div>
              <span
                className="
                  uppercase
                  font-[400]
                  leading-[30px]
                  whitespace-nowrap
                  text-white text-sm sm:text-lg
                "
              >
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => {}}
                className="
                  shadow-0
                  font-[400]
                  border-[2px]
                  px-[24px] h-[46px]
                  text-sm sm:text-lg
                  whitespace-nowrap
                "
              >
                Join the Collective
              </Button>
            </div>

            <div>
              <span
                className="
                  uppercase
                  font-[400]
                  leading-[30px]
                  whitespace-nowrap
                  text-white text-[15px] sm:text-lg
                "
              >
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
        className="
          z-[2]
          relative
          container
          px-[32px] pt-[56px] xl:px-0
          mx-auto mb-[225px] mt-[-22%]
          md:max-w-[980px]
        "
      >
        <FadeInTransition>
          <section className="w-full">
            <Title>The Case</Title>

            <div className="flex flex-col items-center space-y-[56px]">
              <div
                className="
                  text-white text-lg
                  font-[300] text-center flex flex-col space-y-[40px]
                "
              >
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

              <div className="text-center">
                <span className="text-[28px] font-heavy text-white">
                  "THERE’S MORE THAN A STORE..."
                </span>
              </div>

              <div className="text-center">
                <span className="text-white text-lg md:leading-[38px] font-[300] text-center">
                  Police Chief Ima Resting has requested the assistance of
                   public volunteers to help in solving this high-profile
                  case.
                </span>
              </div>

              <div className="h-[100px] w-[100px] flex items-center justify-center">
                <img
                  loading="lazy"
                  src="./images/question.png"
                  className="relative left-[4px] h-[100px] w-[100px]"
                />
              </div>
            </div>
          </section>
        </FadeInTransition>
      </div>

      <div
        id="how-to-play"
        className="container mx-auto relative px-[32px] max-w-[1140px]"
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
        className="container mx-auto relative px-[32px] max-w-[1140px] pt-[50px]"
      >
        <FadeInTransition>
          <section className="relative">
            <img
              src="./images/pins.png"
              className="hidden xl:block absolute scale-[1] left-[18px] top-[100px]"
            />

            <Title>Roadmap</Title>

            <Roadmap />
          </section>
        </FadeInTransition>
      </div>

      <div
        id="sneak-peeks"
        className="container mx-auto pb-[71px] mb-[54px] bg-[url('/svgs/bricks.svg')] bg-[length:auto_100%] px-[30px] xl:px-0 pt-[108px]"
      >
        <FadeInTransition>
          <section className="container mx-auto max-w-screen-xl">
            <Title>Sneak Peeks</Title>

            <SneakPeeks />
          </section>
        </FadeInTransition>
      </div>
    </div>
  );
};

export default Index;
