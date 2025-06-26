import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'; 
import { anvil2Address, mockTokenAddress, oneAmount } from '../test-constants';

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdropform when connected, otherwise not", async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('/');

  await expect(page.getByText("지갑을 연결해주세요")).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);

  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: 'visible',
    timeout: 30000
  });
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  await page.getByRole('textbox', { name: '0x', exact: true }).waitFor({
    state: 'visible',
    timeout: 30000
  });

  await page.getByRole('textbox', { name: '0x', exact: true }).fill(mockTokenAddress);
  await page.getByRole('textbox', { name: '0x123..., 0x456...' }).fill(anvil2Address);
  await page.getByRole('textbox', { name: '200, 300...' }).fill(oneAmount);
  await expect(page.getByText('Token Name:Mock Token')).toBeVisible();
});