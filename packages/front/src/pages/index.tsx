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
          bg-no-repeat bg-[url('./assets/background-home.png')] bg-[length:100%_100%]
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
            bg-no-repeat bg-[url('./assets/svgs/clouds.svg')] bg-[center_top_190px]
          "
        >
          <div>
            <img src="./assets/hero.png" className="max-w-[1129px] mx-auto" />
          </div>

          <div className="flex items-center space-x-[40px]">
            <div>
              <span className="uppercase text-white text-[25px] font-[200] leading-[30px]">
                Minting soon
              </span>
            </div>

            <div>
              <Button
                onClick={() => {}}
                className="px-[30px] h-[58px] text-[23px] border-[2px]"
              >
                Join the whitelist
              </Button>
            </div>

            <div>
              <span className="uppercase text-white text-[25px] font-[200] leading-[30px]">
                Limited supply
              </span>
            </div>
          </div>
        </section>

        <div className="w-full max-w-[1920px] mx-auto">
          <img src="./assets/svgs/silhouette.svg" className="w-full" />
        </div>
      </div>

      <div className="container mx-auto mt-[-120px] mb-[140px]">
        <section className="w-full">
          <Title>How to Play</Title>

          <About />
        </section>
      </div>

      <div className="container mx-auto relative overflow-hidden mb-[200px]">
        <section>
          <img
            src="./assets/pins.png"
            className="absolute scale-[1.05] left-[40px] top-[65px]"
          />

          <Title>Roadmap</Title>

          <Roadmap />
        </section>
      </div>

      <div className="container mx-auto pb-[135px]">
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
