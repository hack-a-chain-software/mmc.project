import { Slider, Button } from "@/components";

export const Index = () => {
  return (
    <main className="w-screen min-h-screen bg-[url('./assets/svgs/clouds.svg')] bg-[center_top_290px] bg-no-repeat">
      <Slider />

      <section className="flex flex-col items-center pt-[82px] pb-[296px] space-y-[125px] max-w-[1620px] mx-auto">
        <div>
          <img src="./assets/hero.png" className="max-w-[1129px] mx-auto" />
        </div>

        <div className="flex items-center space-x-[40px]">
          <div>
            <span className="uppercase text-white text-[25px] font-[300]">
              Minting soon
            </span>
          </div>

          <div>
            <Button
              onClick={() => {}}
              className="px-[24px] h-[58px] border-[2px] text-[26px]"
            >
              Join the whitelist
            </Button>
          </div>

          <div>
            <span className="uppercase text-white text-[25px] font-[300]">
              Limited supply
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto">
        <img
          src="./assets/svgs/silhouette.svg"
          className="w-full max-w-[1920px]"
        />
      </div>
    </main>
  );
};

export default Index;
