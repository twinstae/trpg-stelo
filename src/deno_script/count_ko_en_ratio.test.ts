import { assertEquals } from 'https://deno.land/std@0.167.0/testing/asserts.ts';
import { count_ko_en_ratio } from './count_ko_en_ratio.ts';

Deno.test(async function count_ko_en_ratio_test() {
	const result = await count_ko_en_ratio();
	assertEquals(result, 0);
});
