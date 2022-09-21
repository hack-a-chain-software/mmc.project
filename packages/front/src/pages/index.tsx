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
            space-y-[125px]
            mx-auto
            bg-no-repeat bg-[url('/svgs/clouds.svg')] bg-[center_top_190px]
          "
        >
          <div className="min-h-[500px]">
            <img
              src="./images/hero.webp"
              loading="eager"
              className="max-w-[1129px] mx-auto"
            />
          </div>

          <div className="flex items-center space-x-[40px]">
            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[22px] font-[300]">
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => {}}
                className="text-[22px] h-[60px] border-[2px] font-[400] shadow-0 w-[375px] text-[22px]"
              >
                Join the whitelist
              </Button>
            </div>

            <div>
              <span className="uppercase text-white font-[200] leading-[30px] text-[22px]">
                Limited supply
              </span>
            </div>
          </div>
        </section>

        <div className="w-full max-w-[1920px] mx-auto">
          <img src="./svgs/silhouette.svg" className="w-full" />
        </div>
      </div>

      <div className="container mx-auto mt-[-350px] mb-[200px]">
        <section className="w-full">
          <Title>The Case</Title>

          <div className="mt-[-65px] flex flex-col items-center">
            <div className="text-white text-[28px] leading-[40px] font-[300] text-center flex flex-col space-y-[32px] mb-[50px]">
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

            <div className="flex items-center space-x-[25px] mb-[50px]">
              <div className="h-[95px] w-[95px] bg-[#A500FB] rounded-full border flex items-center justify-center">
                <img
                  loading="lazy"
                  src="./svgs/question.svg"
                  className="relative left-[4px] h-[90px]"
                />
              </div>

              <div className="border-y-[1px] py-[8px]">
                <span className="text-white text-[40px]">
                  THERE’S MORE THAN A STORE
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-white text-[28px] leading-[40px] font-[300]">
                Police Chief Ima Resting has requested the assistance of public
                volunteers to help in solving this high-profile case.
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto relative overflow-hidden mb-[200px]">
        <section>
          <Title>How to Play</Title>

          <About />
        </section>
      </div>

      <div className="container mx-auto relative overflow-hidden mb-[200px]">
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
        className="container mx-auto pb-[135px]
      bg-[url('/svgs/bricks.svg')] bg-[length:100%_100%]"
      >
        <section className="space-y-[120px]">
          <Title className="pb-[269px]">Sneak Peeks</Title>

          <SneakPeeks />
        </section>
      </div>

      <PageFooter />
    </main>
  );
};

export default Index;
