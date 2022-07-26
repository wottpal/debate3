/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type { FunctionFragment, Result } from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from '../common'

export interface AuctionInterface extends utils.Interface {
  functions: {
    'bid()': FunctionFragment
    'withdraw()': FunctionFragment
    'endAuction()': FunctionFragment
    'beneficiary()': FunctionFragment
    'auctionStart()': FunctionFragment
    'auctionEnd()': FunctionFragment
    'highestBidder()': FunctionFragment
    'highestBid()': FunctionFragment
    'ended()': FunctionFragment
    'pendingReturns(address)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'bid'
      | 'withdraw'
      | 'endAuction'
      | 'beneficiary'
      | 'auctionStart'
      | 'auctionEnd'
      | 'highestBidder'
      | 'highestBid'
      | 'ended'
      | 'pendingReturns'
  ): FunctionFragment

  encodeFunctionData(functionFragment: 'bid', values?: undefined): string
  encodeFunctionData(functionFragment: 'withdraw', values?: undefined): string
  encodeFunctionData(functionFragment: 'endAuction', values?: undefined): string
  encodeFunctionData(functionFragment: 'beneficiary', values?: undefined): string
  encodeFunctionData(functionFragment: 'auctionStart', values?: undefined): string
  encodeFunctionData(functionFragment: 'auctionEnd', values?: undefined): string
  encodeFunctionData(functionFragment: 'highestBidder', values?: undefined): string
  encodeFunctionData(functionFragment: 'highestBid', values?: undefined): string
  encodeFunctionData(functionFragment: 'ended', values?: undefined): string
  encodeFunctionData(functionFragment: 'pendingReturns', values: [PromiseOrValue<string>]): string

  decodeFunctionResult(functionFragment: 'bid', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'endAuction', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'beneficiary', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'auctionStart', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'auctionEnd', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'highestBidder', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'highestBid', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'ended', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'pendingReturns', data: BytesLike): Result

  events: {}
}

export interface Auction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: AuctionInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    bid(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    withdraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    endAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    beneficiary(overrides?: CallOverrides): Promise<[string]>

    auctionStart(overrides?: CallOverrides): Promise<[BigNumber]>

    auctionEnd(overrides?: CallOverrides): Promise<[BigNumber]>

    highestBidder(overrides?: CallOverrides): Promise<[string]>

    highestBid(overrides?: CallOverrides): Promise<[BigNumber]>

    ended(overrides?: CallOverrides): Promise<[boolean]>

    pendingReturns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>
  }

  bid(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>

  endAuction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  beneficiary(overrides?: CallOverrides): Promise<string>

  auctionStart(overrides?: CallOverrides): Promise<BigNumber>

  auctionEnd(overrides?: CallOverrides): Promise<BigNumber>

  highestBidder(overrides?: CallOverrides): Promise<string>

  highestBid(overrides?: CallOverrides): Promise<BigNumber>

  ended(overrides?: CallOverrides): Promise<boolean>

  pendingReturns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>

  callStatic: {
    bid(overrides?: CallOverrides): Promise<void>

    withdraw(overrides?: CallOverrides): Promise<void>

    endAuction(overrides?: CallOverrides): Promise<void>

    beneficiary(overrides?: CallOverrides): Promise<string>

    auctionStart(overrides?: CallOverrides): Promise<BigNumber>

    auctionEnd(overrides?: CallOverrides): Promise<BigNumber>

    highestBidder(overrides?: CallOverrides): Promise<string>

    highestBid(overrides?: CallOverrides): Promise<BigNumber>

    ended(overrides?: CallOverrides): Promise<boolean>

    pendingReturns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>
  }

  filters: {}

  estimateGas: {
    bid(overrides?: PayableOverrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>

    withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>

    endAuction(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>

    beneficiary(overrides?: CallOverrides): Promise<BigNumber>

    auctionStart(overrides?: CallOverrides): Promise<BigNumber>

    auctionEnd(overrides?: CallOverrides): Promise<BigNumber>

    highestBidder(overrides?: CallOverrides): Promise<BigNumber>

    highestBid(overrides?: CallOverrides): Promise<BigNumber>

    ended(overrides?: CallOverrides): Promise<BigNumber>

    pendingReturns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    bid(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    withdraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    endAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    beneficiary(overrides?: CallOverrides): Promise<PopulatedTransaction>

    auctionStart(overrides?: CallOverrides): Promise<PopulatedTransaction>

    auctionEnd(overrides?: CallOverrides): Promise<PopulatedTransaction>

    highestBidder(overrides?: CallOverrides): Promise<PopulatedTransaction>

    highestBid(overrides?: CallOverrides): Promise<PopulatedTransaction>

    ended(overrides?: CallOverrides): Promise<PopulatedTransaction>

    pendingReturns(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>
  }
}
